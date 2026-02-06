## Deadlock: await vs nested loop

### 1) The **`await` method** (correct)

```python
async def outer():
  result = await inner()
  return result
```

**What happens (scheduling-wise):**

* `outer()` hits `await inner()`
* `outer()` **suspends voluntarily** (it does *not* block the OS thread)
* Control returns to the **same event loop**
* The event loop keeps running:

  * processes I/O readiness
  * runs callbacks
  * marks Futures done
  * resumes coroutines (including `inner()` then later `outer()`)

**Deadlock implication:**
✅ **No deadlock** (because the event loop keeps getting CPU time to complete the awaited Future).

**Key property:** `await` = “*pause me, let the loop run*”.

### 2) The **nested loop method** (problematic)

Typical shape (conceptually):

```python
async def outer():
  loop = asyncio.get_running_loop()
  return loop.run_until_complete(inner())  # ❌ nesting
```

**What happens (scheduling-wise):**

* `outer()` calls `run_until_complete(...)`
* That call is **blocking**: it tries to *take over* the thread and drive the loop “until done”
* But you are **already inside** a running loop on that same thread

Now the deadly cycle:

* `inner()` will eventually do an `await` (meaning: “complete some Future later”)
* Completing that Future requires the **original loop to keep running**
* But the original loop can’t run because you’re **blocking it** trying to run “another loop” (or re-run the same one re-entrantly)

**Deadlock implication:**
❌ **Deadlock risk / fundamental conflict** (in asyncio it’s usually prevented by raising `RuntimeError: This event loop is already running`, but if you bypass it with hacks like `nest_asyncio`, you can create real hangs.)

**Key property:** nested loop = “*don’t pause me; I will block the loop thread until completion*”.

## Side-by-side: the one difference that matters

| Aspect                             | `await inner()` | `run_until_complete(inner())` inside async |
| ---------------------------------- | --------------- | ------------------------------------------ |
| What `outer()` does                | **Suspends**    | **Blocks**                                 |
| Does the event loop keep running?  | ✅ Yes           | ❌ No (or it becomes re-entrant/competing)  |
| Can awaited Futures get completed? | ✅ Yes           | ❌ Often no → circular wait                 |
| Typical asyncio behavior           | Works           | Throws (or hangs if forced)                |

## The deadlock “soundbite”

* **`await`**: “I’m waiting, so I’ll *get out of the way* and let the event loop make progress.”
* **Nested loop**: “I’m waiting, so I’ll *hog the only thread* the event loop needs to make progress.”

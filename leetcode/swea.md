```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Swea {
// SWEA: 27005

    private static int nCase = 0;
    private static int[] testcases;

    private static int maxFireIdx;
    private static int[] fireArray;

    private static void processInput() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        StringTokenizer stringTokenizer = new StringTokenizer(line);

        nCase = Integer.parseInt(stringTokenizer.nextToken());
        testcases = new int[nCase];

        maxFireIdx = 1;
        for (int lineIdx = 0; lineIdx < nCase; lineIdx++) {
            line = br.readLine();
            stringTokenizer = new StringTokenizer(line);
            int tc = Integer.parseInt(stringTokenizer.nextToken());
            testcases[lineIdx] = tc;

            maxFireIdx = Math.max(maxFireIdx, tc);
        }

        fireArray = new int[maxFireIdx + 1];
        fireArray[0] = 1;
        fireArray[1] = 1;

        return;
    }

    private static boolean checkCand(int cand, int idx) {
        int kMax = idx / 2;
        for (int k = 1; k <= kMax; k++) {
            if (cand - fireArray[idx - k] == fireArray[idx - k] - fireArray[idx - 2 * k]) return false;
        }
        return true;
    }

    private static int computeForIdx(int idx) {
        int candidate = 1;

        while (!checkCand(candidate, idx)) {
            candidate += 1;
        }

        return candidate;
    }

    private static void execute() {
        if (maxFireIdx <= 1) return;

        for (int idx = 2; idx <= maxFireIdx; idx++) {
            // find the min value for the idx
            fireArray[idx] = computeForIdx(idx);
        }

        return;
    }

    public static void main(String[] args) throws IOException {
        processInput();
        execute();

        StringBuilder sb = new StringBuilder();
        for (int idx = 0; idx < nCase; idx++) {
            sb.append(fireArray[testcases[idx]]);
            sb.append("\n");
        }

        System.out.println(sb.toString());
    }

}
```

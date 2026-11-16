import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

public class Solution {

    private static final int N_TC = 10;

    private static StringBuilder stringBuilder = new StringBuilder();

    private static void computeInsert(List<Integer> code, int appendIdx, int[] items) {
        for (int item: items) {
            code.add(appendIdx++, item);
        }
    }

    private static void computeDelete(List<Integer> code, int deleteIdx, int nDelete) {
        for (int i = 0; i < nDelete; i++) {
            code.remove(deleteIdx);
        }
    }

    private static void computeAdd(List<Integer> code, int[] items) {
        for (int item: items) {
            code.add(item);
        }
    }

    private static void computeOneTc(List<Integer> code, String instructions) {
        StringTokenizer tokenizer = new StringTokenizer(instructions);

        while (tokenizer.hasMoreTokens()) {
            String insType = tokenizer.nextToken();

            if (insType.equals("I")) {
                int appendIdx = Integer.parseInt(tokenizer.nextToken());
                int nAppend = Integer.parseInt(tokenizer.nextToken());

                int[] items = new int[nAppend];
                for (int idx = 0; idx < nAppend; idx++) {
                    items[idx] = Integer.parseInt(tokenizer.nextToken());
                }

                computeInsert(code, appendIdx, items);
            }
            if (insType.equals("D")) {
                int deleteIdx = Integer.parseInt(tokenizer.nextToken());
                int nDelete = Integer.parseInt(tokenizer.nextToken());

                computeDelete(code, deleteIdx, nDelete);
            }
            if (insType.equals("A")) {
                int nAdd = Integer.parseInt(tokenizer.nextToken());

                int[] items = new int[nAdd];
                for (int idx = 0; idx < nAdd; idx++) {
                    items[idx] = Integer.parseInt(tokenizer.nextToken());
                }

                computeAdd(code, items);
            }

        }
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));

        for (int tcIdx = 1; tcIdx <= N_TC; tcIdx++) {
            int codeSize = Integer.parseInt(reader.readLine().trim());

            List<Integer> code = new ArrayList<>();
            StringTokenizer tokenizer = new StringTokenizer(reader.readLine());
            for (int idx = 0; idx < codeSize; idx++) {
                code.add(Integer.parseInt(tokenizer.nextToken()));
            }

            int nInstruction = Integer.parseInt(reader.readLine().trim());
            String instructions = reader.readLine().trim();

            computeOneTc(code, instructions);

            stringBuilder.append("#" + tcIdx);
            for (int idx = 0; idx < 10; idx++) {
                stringBuilder.append(" " + code.get(idx));
            }
            stringBuilder.append("\n");
        }

        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
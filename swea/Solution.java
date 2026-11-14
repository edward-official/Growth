import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

public class Solution {

    private static final int N_TC = 10;

    private static StringBuilder stringBuilder = new StringBuilder();

    private static List<int[]> processInstructions(String instructions, int nInstruction) {
        List<int[]> processed = new ArrayList<>();

        StringTokenizer tokenizer = new StringTokenizer(instructions);

        for (int insIdx = 0; insIdx < nInstruction; insIdx++) {

            String insCode = tokenizer.nextToken();
            if (!insCode.equals("I")) {
                System.out.println("insCode = " + insCode);
                return processed;
            }

            int appendIdx = Integer.parseInt(tokenizer.nextToken());
            int nAppend = Integer.parseInt(tokenizer.nextToken());

            int[] ins = new int[nAppend + 2];
            ins[0] = appendIdx;
            ins[1] = nAppend;
            for (int idx = 0; idx < nAppend; idx++) {
                ins[idx + 2] = Integer.parseInt(tokenizer.nextToken());
            }

            processed.add(ins);
        }

        return processed;
    }

    private static void handleOneTc(List<Integer> code, List<int[]> instructions) {
        int n = instructions.size();

        for (int insIdx = 0; insIdx < n; insIdx++) {
            int[] ins = instructions.get(insIdx);

            int appendIdx = ins[0];
            int nAppend = ins[1];

            for (int idx = 0; idx < nAppend; idx++) {
                code.add(appendIdx++, ins[idx + 2]);
            }
        }
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));

        StringTokenizer tokenizer;
        for (int tcIdx = 1; tcIdx <= N_TC; tcIdx++) {
            tokenizer = new StringTokenizer(reader.readLine());
            int n = Integer.parseInt(tokenizer.nextToken());

            tokenizer = new StringTokenizer(reader.readLine());
            List<Integer> code = new ArrayList<>();
            for (int idx = 0; idx < n; idx++) {
                code.add(Integer.parseInt(tokenizer.nextToken()));
            }

            int nInstruction = Integer.parseInt(reader.readLine().trim());
            String instructions = reader.readLine();

            stringBuilder.append("#" + tcIdx);

            handleOneTc(code, processInstructions(instructions, nInstruction));
            for (int idx = 0; idx < 10; idx++) {
                stringBuilder.append(" " + code.get(idx));
            }

            stringBuilder.append("\n");
        }

        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
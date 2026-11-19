import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

public class Solution {

    private static final int N_TC = 10;

    private static StringBuilder stringBuilder = new StringBuilder();

    private static List<List<String>> parseIns(int nIns, String compIns) {
        List<List<String>> rv = new ArrayList<>();

        StringTokenizer tokenizer = new StringTokenizer(compIns);

        for (int insIdx = 0; insIdx < nIns; insIdx++) {
            List<String> ins = new ArrayList<>();
            rv.add(ins);

            String insCode = tokenizer.nextToken();
            ins.add(insCode);

            if (insCode.equals("I")) {
                String idxToken = tokenizer.nextToken();
                ins.add(idxToken);

                String nToken = tokenizer.nextToken();
                ins.add(nToken);

                int n = Integer.parseInt(nToken);
                for (int itemIdx = 0; itemIdx < n; itemIdx++) {
                    ins.add(tokenizer.nextToken());
                }
            }
            if (insCode.equals("D")) {
                String idxToken = tokenizer.nextToken();
                ins.add(idxToken);

                String nToken = tokenizer.nextToken();
                ins.add(nToken);
            }
        }

        return rv;
    }

    private static void processIns(List<Integer> code, List<String> ins) {
        String insCode = ins.get(0);

        int idx = Integer.parseInt(ins.get(1));
        int n = Integer.parseInt(ins.get(2));

        if (insCode.equals("I")) {
            for (int itemIdx = 0; itemIdx < n; itemIdx++) {
                code.add(idx++, Integer.parseInt(ins.get(itemIdx + 3)));
            }
        }
        if (insCode.equals("D")) {
            for (int deleteIdx = 0; deleteIdx < n; deleteIdx++) {
                code.remove(idx);
            }
        }
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));

        StringTokenizer tokenizer;
        for (int tcIdx = 0; tcIdx < N_TC; tcIdx++) {
            int codeLength = Integer.parseInt(reader.readLine().trim());

            tokenizer = new StringTokenizer(reader.readLine());
            List<Integer> code = new ArrayList<>();
            while (tokenizer.hasMoreTokens()) {
                code.add(Integer.parseInt(tokenizer.nextToken()));
            }

            if (code.size() != codeLength) {
                System.out.println("error");
                return;
            }

            int nIns = Integer.parseInt(reader.readLine());
            String compIns = reader.readLine().trim();

            List<List<String>> insArr = parseIns(nIns, compIns);
            for (List<String> ins: insArr) {
                processIns(code, ins);
            }

            stringBuilder.append("#" + (tcIdx + 1));
            for (int idx = 0; idx < 10; idx++) {
                stringBuilder.append(" " + code.get(idx));
            }
            stringBuilder.append("\n");
        }

        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
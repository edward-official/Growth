import java.io.*;
import java.util.StringTokenizer;

public class Solution {
    // SWEA: 26837
    private static StringBuilder stringBuilder = new StringBuilder();

    private static void execute(String target) {
        int n = target.length();
        int result = 0;

        for (int openingIdx = 0; openingIdx < n; openingIdx++) {
            int aCount = 0;
            int cCount = 0;

            for (int closingIdx = openingIdx + 1; closingIdx < n; closingIdx += 2) {
                for (int idx = closingIdx - 1; idx <= closingIdx; idx++) {
                    if (target.charAt(idx) == 'A') aCount += 1;
                    if (target.charAt(idx) == 'T') aCount -= 1;
                    if (target.charAt(idx) == 'C') cCount += 1;
                    if (target.charAt(idx) == 'G') cCount -= 1;
                }

                if (aCount == 0 && cCount == 0) result += 1;
            }
        }

        stringBuilder.append(result).append("\n");
        return;
    }

    public static void main(String[] args) throws IOException {
        /*
        * start index
        * length: 2, 4, 6, ...
        * */

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();

        StringTokenizer tokenizer = new StringTokenizer(line);
        int nCases = Integer.parseInt(tokenizer.nextToken());

        String[] cases = new String[nCases];
        for (int idx = 0; idx < nCases; idx++) {
            line = br.readLine();
            tokenizer = new StringTokenizer(line);

            int _n = Integer.parseInt(tokenizer.nextToken());
            cases[idx] = tokenizer.nextToken();

            execute(cases[idx]);
        }

        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));
        bw.write(stringBuilder.toString());
        bw.flush();
    }
}

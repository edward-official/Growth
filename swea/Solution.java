import java.io.*;
import java.util.StringTokenizer;

public class Solution {

    private static StringBuilder stringBuilder = new StringBuilder();

    private static void handleOne(int[][] farm, int width) {
        int center = width / 2;

        int harvest = 0;
        for (int rIdx = 0; rIdx <= center; rIdx++) {
            for (int cIdx = center - rIdx; cIdx <= center + rIdx; cIdx++) {
                harvest += farm[rIdx][cIdx];
            }
        }

        for (int rIdx = center + 1; rIdx < width; rIdx++) {
            for (int cIdx = rIdx - center; cIdx <= 3 * center - rIdx; cIdx++) {
                harvest += farm[rIdx][cIdx];
            }
        }

        stringBuilder.append(harvest).append("\n");
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer tokenizer = new StringTokenizer(reader.readLine());

        int nTestcases = Integer.parseInt(tokenizer.nextToken());

        for (int idx = 0; idx < nTestcases; idx++) {
            tokenizer = new StringTokenizer(reader.readLine());
            int width = Integer.parseInt(tokenizer.nextToken());

            int[][] farm = new int[width][width];
            for (int rIdx = 0; rIdx < width; rIdx++) {
                tokenizer = new StringTokenizer(reader.readLine());
                String digits = tokenizer.nextToken();

                for (int cIdx = 0; cIdx < width; cIdx++) {
                    farm[rIdx][cIdx] = digits.charAt(cIdx) - '0';
                }
            }

            stringBuilder.append("#" + (idx + 1) + " ");
            handleOne(farm, width);
        }

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));
        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
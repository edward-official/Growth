import java.io.*;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Solution {

    private static final int WIDTH = 100;
    private static final int N_TC = 10;

    private static StringBuilder stringBuilder = new StringBuilder();

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));

        for (int tc = 1; tc <= N_TC; tc++) {
            StringTokenizer tokenizer = new StringTokenizer(reader.readLine());
            int tcIdx = Integer.parseInt(tokenizer.nextToken());

            int[][] board = new int[WIDTH][WIDTH];

            int[] rSum = new int[WIDTH];
            int[] cSum = new int[WIDTH];
            int ascDiag = 0;
            int descDiag = 0;

            for (int rIdx = 0; rIdx < WIDTH; rIdx++) {
                tokenizer = new StringTokenizer(reader.readLine());

                for (int cIdx = 0; cIdx < WIDTH; cIdx++) {
                    board[rIdx][cIdx] = Integer.parseInt(tokenizer.nextToken());

                    rSum[rIdx] += board[rIdx][cIdx];
                    cSum[cIdx] += board[rIdx][cIdx];
                    if (rIdx + cIdx == WIDTH - 1) ascDiag += board[rIdx][cIdx];
                    if (rIdx == cIdx) descDiag += board[rIdx][cIdx];
                }
            }

            int maxSumR = Arrays.stream(rSum).max().getAsInt();
            int maxSumC = Arrays.stream(cSum).max().getAsInt();
            int answer = Math.max(Math.max(maxSumR, maxSumC), Math.max(ascDiag, descDiag));
            stringBuilder.append("#" + tcIdx + " " + answer).append("\n");
        }

        writer.write(stringBuilder.toString());
        writer.flush();

    }
}
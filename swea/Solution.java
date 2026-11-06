import java.io.*;
import java.util.StringTokenizer;

public class Solution {

    private static StringBuilder stringBuilder = new StringBuilder();
    private static int countAttached = 0;

    private static void handleOne(int[][] board, int width) {
        countAttached = 0;

        for (int cIdx = 0; cIdx < width; cIdx++) {
            for (int rIdx = 0; rIdx < width; rIdx++) {
                if (board[rIdx][cIdx] == 1) break;
                if (board[rIdx][cIdx] == 2) board[rIdx][cIdx] = 0;
            }
            for (int rIdx = width - 1; rIdx >= 0; rIdx--) {
                if (board[rIdx][cIdx] == 2) break;
                if (board[rIdx][cIdx] == 1) board[rIdx][cIdx] = 0;
            }

            boolean isOpen = false;
            for (int rIdx = 0; rIdx < width; rIdx++) {
                if (!isOpen && board[rIdx][cIdx] == 1) isOpen = true;
                else if (isOpen && board[rIdx][cIdx] == 2) {
                    isOpen = false;
                    countAttached += 1;
                }
            }
        }
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer tokenizer;

        int nGiven = 10;
        for (int i = 0; i < nGiven; i++) {
            tokenizer = new StringTokenizer(reader.readLine());
            int width = Integer.parseInt(tokenizer.nextToken());

            int[][] board = new int[width][width];
            for (int r = 0; r < width; r++) {
                tokenizer = new StringTokenizer(reader.readLine());

                for (int c = 0; c < width; c++) {
                    board[r][c] = Integer.parseInt(tokenizer.nextToken());
                }
            }

            handleOne(board, width);
            stringBuilder.append("#" + (i + 1) + " " + countAttached).append("\n");
        }

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));
        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
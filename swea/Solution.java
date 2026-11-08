import java.io.*;
import java.util.StringTokenizer;

public class Solution {

    private static final int N_TESTCASE = 10;
    private static final int WIDTH = 8;

    private static String[] board = new String[WIDTH];
    private static int answer = 0;

    private static StringBuilder stringBuilder = new StringBuilder();
    private static BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
    private static BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));

    private static void scanBoard() throws IOException {
        for (int rIdx = 0; rIdx < WIDTH; rIdx++) {
            board[rIdx] = reader.readLine();
        }
    }

    private static void rowDirection(int n, int rIdx, int cIdx) {
        if (rIdx + n > WIDTH) return;

        for (int offset = 0; offset < n / 2; offset++) {
            int r1 = rIdx + offset;
            int r2 = rIdx + n - 1 - offset;

            if (board[r1].charAt(cIdx) != board[r2].charAt(cIdx)) return;
        }

        answer += 1;
    }

    private static void columnDirection(int n, int rIdx, int cIdx) {
        if (cIdx + n > WIDTH) return;

        for (int offset = 0; offset < n / 2; offset++) {
            int c1 = cIdx + offset;
            int c2 = cIdx + n - 1 - offset;

            if (board[rIdx].charAt(c1) != board[rIdx].charAt(c2)) return;
        }

        answer += 1;
    }

    private static void checkPalindrome(int n, int rIdx, int cIdx) {
        rowDirection(n, rIdx, cIdx);
        columnDirection(n, rIdx, cIdx);
    }

    private static void handleTc() throws IOException {
        answer = 0;

        StringTokenizer tokenizer = new StringTokenizer(reader.readLine());
        int n = Integer.parseInt(tokenizer.nextToken());
        scanBoard();

        for (int rIdx = 0; rIdx < WIDTH; rIdx++) {
            for (int cIdx = 0; cIdx < WIDTH; cIdx++) {
                checkPalindrome(n, rIdx, cIdx);
            }
        }
    }

    public static void main(String[] args) throws IOException {
        for (int idx = 0; idx < N_TESTCASE; idx++) {
            handleTc();
            stringBuilder.append("#" + (idx + 1) + " " + answer).append("\n");
        }

        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
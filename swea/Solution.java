import java.io.*;
import java.util.StringTokenizer;

public class Solution {

    private static StringBuilder stringBuilder = new StringBuilder();

    private static final int N_TC = 10;
    private static final int WIDTH = 100;

    private static int tcAnswer = 1;

    private static boolean rCheckPoint(String[] board, int rIdx, int cIdx, int length) {
        for (int offset = 0; offset < length / 2; offset++) {
            char letterL = board[rIdx + offset].charAt(cIdx);
            char letterR = board[rIdx + length - 1 - offset].charAt(cIdx);

            if (letterL != letterR) return false;
        }
        return true;
    }

    private static boolean rHasLenght(String[] board, int length) {
        for (int cIdx = 0; cIdx < WIDTH; cIdx++) {
            for (int rIdx = 0; rIdx < WIDTH; rIdx++) {

                if (rIdx + length > WIDTH) break;
                if (rCheckPoint(board, rIdx, cIdx, length)) return true;
            }
        }
        return false;
    }

    private static int rDir(String[] board, int minLength) {
        int rv = minLength;

        for (int length = minLength + 1; length <= WIDTH; length++) {
            if (rHasLenght(board, length)) rv = length;
        }

        return rv;
    }

    private static boolean cCheckPoint(String[] board, int rIdx, int cIdx, int length) {
        for (int offset = 0; offset < length / 2; offset++) {
            char letterL = board[rIdx].charAt(cIdx + offset);
            char letterR = board[rIdx].charAt(cIdx + length - 1 - offset);

            if (letterL != letterR) return false;
        }
        return true;
    }

    private static boolean cHasLenght(String[] board, int length) {
        for (int rIdx = 0; rIdx < WIDTH; rIdx++) {
            for (int cIdx = 0; cIdx < WIDTH; cIdx++) {

                if (cIdx + length > WIDTH) break;
                if (cCheckPoint(board, rIdx, cIdx, length)) return true;
            }
        }
        return false;
    }

    private static int cDir(String[] board, int minLength) {
        int rv = minLength;

        for (int length = minLength + 1; length <= WIDTH; length++) {
            if (cHasLenght(board, length)) rv = length;
        }

        return rv;
    }

    private static void oneTc(String[] board) {
        tcAnswer = 1;
        tcAnswer = Math.max(rDir(board, tcAnswer), tcAnswer);
        tcAnswer = Math.max(cDir(board, tcAnswer), tcAnswer);
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));

        for (int tc = 1; tc <= N_TC; tc++) {
            StringTokenizer tokenizer = new StringTokenizer(reader.readLine());
            int tcGiven = Integer.parseInt(tokenizer.nextToken());

            String[] board = new String[WIDTH];
            for (int idx = 0; idx < WIDTH; idx++) {
                board[idx] = reader.readLine();
            }

            oneTc(board);

            stringBuilder.append("#" + tcGiven + " " + tcAnswer).append("\n");
        }

        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
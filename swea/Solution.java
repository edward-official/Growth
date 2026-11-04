import java.io.*;
import java.util.StringTokenizer;

public class Solution {

    private static StringBuilder stringBuilder = new StringBuilder();

    private static boolean[] rowCheck;
    private static boolean[] columnCheck;
    private static boolean[] ascDiagCheck;
    private static boolean[] descDiagCheck;

    private static int answerCnt;

    private static void setArray(int boardWidth) {
        rowCheck = new boolean[boardWidth];
        columnCheck = new boolean[boardWidth];
        ascDiagCheck = new boolean[boardWidth * 2 - 1];
        descDiagCheck = new boolean[boardWidth * 2 - 1];
    }

    private static boolean isFree(int rIdx, int cIdx, int width) {
        if (rowCheck[rIdx]) return false;
        if (columnCheck[cIdx]) return false;
        if (ascDiagCheck[rIdx + cIdx]) return false;
        if (descDiagCheck[rIdx - cIdx + width - 1]) return false;

        return true;
    }

    private static void setBoardCell(int rIdx, int cIdx, int width, boolean setValue) {
        rowCheck[rIdx] = setValue;
        columnCheck[cIdx] = setValue;
        ascDiagCheck[rIdx + cIdx] = setValue;
        descDiagCheck[rIdx - cIdx + width - 1] = setValue;
    }

    private static void handleOne(int rIdx, int boardWidth) {
        if (rIdx == boardWidth) {
            answerCnt += 1;
            return;
        }

        for (int cIdx = 0; cIdx < boardWidth; cIdx++) {
            if (isFree(rIdx, cIdx, boardWidth)) {
                setBoardCell(rIdx, cIdx, boardWidth, true);
                handleOne(rIdx + 1, boardWidth);
                setBoardCell(rIdx, cIdx, boardWidth, false);
            }
        }
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer tokenizer = new StringTokenizer(reader.readLine());

        int nGiven = Integer.parseInt(tokenizer.nextToken());
        String line;
        int idx = 1;
        while ((line = reader.readLine()) != null) {
            tokenizer = new StringTokenizer(line);
            int boardWidth = Integer.parseInt(tokenizer.nextToken());

            setArray(boardWidth);
            answerCnt = 0;

            handleOne(0, boardWidth);

            stringBuilder.append("#" + idx + " " + answerCnt).append("\n");
            idx += 1;
        }

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));
        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
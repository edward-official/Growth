import java.io.*;
import java.util.StringTokenizer;

public class Solution {

    private static StringBuilder stringBuilder = new StringBuilder();

    private static final int N_TC = 10;

    private static boolean isPointValid(String piece, String line, int openingIdx) {
        if (openingIdx + piece.length() > line.length()) return false;

        for (int idx = 0; idx < piece.length(); idx++) {
            if (line.charAt(openingIdx + idx) != piece.charAt(idx)) return false;
        }

        return true;
    }

    private static int handleOneTc(String piece, String line) {
        int cnt = 0;

        for (int idx = 0; idx < line.length(); idx++) {
            if (isPointValid(piece, line, idx)) cnt += 1;
        }

        return cnt;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));

        for (int i = 0; i < N_TC; i++) {
            StringTokenizer tokenizer = new StringTokenizer(reader.readLine());
            int tcIdx = Integer.parseInt(tokenizer.nextToken());

            String piece = reader.readLine().trim();
            String line = reader.readLine().trim();

            stringBuilder.append("#" + tcIdx + " " + handleOneTc(piece, line)).append("\n");
        }

        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
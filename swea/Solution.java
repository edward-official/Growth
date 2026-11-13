import java.io.*;
import java.util.StringTokenizer;

public class Solution {

    private static final int N_TC = 10;

    private static StringBuilder stringBuilder = new StringBuilder();

    private static void erase(int n, char[] pw, int idxL, int idxR) {
        while (0 <= idxL && idxL < n && 0 <= idxR && idxR < n) {
            if (pw[idxL] != pw[idxR]) break;

            pw[idxL] = '#';
            pw[idxR] = '#';

            while (0 <= idxL && pw[idxL] == '#') idxL--;
            while (idxR < n && pw[idxR] == '#') idxR++;
        }
    }

    private static int handleOneTc(int n, char[] pw) {
        for (int idxR = 1; idxR < n; idxR++) {
            int idxL = idxR - 1;

            if (pw[idxL] == pw[idxR]) {
                erase(n, pw, idxL, idxR);
            }
        }

        StringBuilder answerBuilder = new StringBuilder();
        for (int idx = 0; idx < n; idx++) {
            if (pw[idx] != '#') answerBuilder.append(pw[idx]);
        }

        return Integer.parseInt(answerBuilder.toString());
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));

        for (int i = 0; i < N_TC; i++) {
            StringTokenizer tokenizer = new StringTokenizer(reader.readLine());
            int n = Integer.parseInt(tokenizer.nextToken());
            char[] pw = tokenizer.nextToken().toCharArray();

            stringBuilder.append("#" + (i + 1) + " " + handleOneTc(n, pw)).append("\n");
        }

        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
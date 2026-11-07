import java.io.*;
import java.util.StringTokenizer;

public class Solution {

    private static StringBuilder stringBuilder = new StringBuilder();
    private static int answer;

    private static final int CODE_LENGTH = 8;
    private static final int N_BIT = 7;

    private static int sumCode(int[] digit) {
        int s1 = 0;
        for (int idx = 0; idx < 8; idx += 2) {
            s1 += digit[idx];
        }

        int s2 = 0;
        for (int idx = 1; idx < 8; idx += 2) {
            s2 += digit[idx];
        }

        if ((s1 * 3 + s2) % 10 == 0) return (s1 + s2);
        return -1;
    }

    private static void handleOne(int r, int c, String[] line) {
        answer = 0;

        int findR = -1;
        int findC = -1;

        for (int rIdx = 0; rIdx < r; rIdx++) {
            for (int cIdx = 0; cIdx < c; cIdx++) {
                if (line[rIdx].charAt(cIdx) == '1') {
                    findR = rIdx;
                    findC = cIdx;
                }
            }
            if (findC != -1) break;
        }

        int openingC = findC - (CODE_LENGTH * N_BIT - 1);
        if (openingC < 0) {
            answer = 0;
            return;
        }

        int[] digit = new int[CODE_LENGTH];
        for (int idx = 0; idx < CODE_LENGTH; idx++) {
            if (line[findR].substring(openingC, openingC + N_BIT).equals("0001101")) digit[idx] = 0;
            else if (line[findR].substring(openingC, openingC + N_BIT).equals("0011001")) digit[idx] = 1;
            else if (line[findR].substring(openingC, openingC + N_BIT).equals("0010011")) digit[idx] = 2;
            else if (line[findR].substring(openingC, openingC + N_BIT).equals("0111101")) digit[idx] = 3;
            else if (line[findR].substring(openingC, openingC + N_BIT).equals("0100011")) digit[idx] = 4;
            else if (line[findR].substring(openingC, openingC + N_BIT).equals("0110001")) digit[idx] = 5;
            else if (line[findR].substring(openingC, openingC + N_BIT).equals("0101111")) digit[idx] = 6;
            else if (line[findR].substring(openingC, openingC + N_BIT).equals("0111011")) digit[idx] = 7;
            else if (line[findR].substring(openingC, openingC + N_BIT).equals("0110111")) digit[idx] = 8;
            else if (line[findR].substring(openingC, openingC + N_BIT).equals("0001011")) digit[idx] = 9;

            openingC += N_BIT;
        }

        answer = sumCode(digit);
        if (answer == -1) answer = 0;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer tokenizer = new StringTokenizer(reader.readLine());

        int nGiven = Integer.parseInt(tokenizer.nextToken());
        for (int testcaseIdx = 0; testcaseIdx < nGiven; testcaseIdx++) {
            tokenizer = new StringTokenizer(reader.readLine());
            int r = Integer.parseInt(tokenizer.nextToken());
            int c = Integer.parseInt(tokenizer.nextToken());

            String[] line = new String[r];
            for (int idx = 0; idx < r; idx++) {
                line[idx] = reader.readLine();
            }

            handleOne(r, c, line);
            stringBuilder.append("#" + (testcaseIdx + 1) + " " + answer).append("\n");
        }

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));
        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
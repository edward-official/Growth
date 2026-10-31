import java.io.*;
import java.util.StringTokenizer;

public class Solution {
    // SWEA 1244 (INCORRECT): greedy cannot reflect the future cost

    private static StringBuilder stringBuilder = new StringBuilder();

    private static int countDigits(int prize) {
        int cnt = 1;

        while (prize >= 10) {
            cnt += 1;
            prize /= 10;
        }

        return cnt;
    }

    private static int[] convertToArray(int prize) {
        int nDigits = countDigits(prize);
        int[] pArray = new int[nDigits];

        int idx = nDigits - 1;
        while (idx >= 0) {
            pArray[idx--] = prize % 10;
            prize /= 10;
        }

        return pArray;
    }

    private static void switchTwo(int[] pArray, int idxL, int idxR) {
        int tmp = pArray[idxL];
        pArray[idxL] = pArray[idxR];
        pArray[idxR] = tmp;
    }

    private static void switchTwo(int[] pArray) {
        int n = pArray.length;

        if (isDescending(pArray)) {
            switchTwo(pArray, n - 2, n - 1);
            return;
        }

        for (int idxL = 0; idxL < n; idxL++) {

            int winnerIdx = -1;
            for (int idxR = idxL + 1; idxR < n; idxR++) {
                if (pArray[idxL] < pArray[idxR]) {
                    if (winnerIdx == -1) winnerIdx = idxR;
                    else if (pArray[winnerIdx] <= pArray[idxR]) winnerIdx = idxR;
                }
            }

            if (winnerIdx != -1) {
                switchTwo(pArray, idxL, winnerIdx);
                return;
            }
        }
    }

    private static boolean isDescending(int[] pArray) {
        int n = pArray.length;

        for (int idx = 1; idx < n; idx++) {
            if (pArray[idx - 1] < pArray[idx]) return false;
        }

        return true;
    }

    private static void executeOne(int prize, int nChange) {
        int[] pArray = convertToArray(prize);
        int pSize = pArray.length;

        while (nChange > 0 && !isDescending(pArray)) {
            switchTwo(pArray);
            nChange -= 1;
        }

        if (isDescending(pArray) && nChange % 2 == 1) {
            boolean twinExists = false;
            for (int idx = 0; idx < pSize - 1; idx++) {
                if (pArray[idx] == pArray[idx + 1]) {
                    twinExists = true;
                    break;
                }
            }

            if (!twinExists) switchTwo(pArray, pSize - 2, pSize - 1);
        }

        for (int idx = 0; idx < pSize; idx++) stringBuilder.append(pArray[idx]);
        stringBuilder.append("\n");
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer tokenizer = new StringTokenizer(reader.readLine());

        int nCases = Integer.parseInt(tokenizer.nextToken());
        for (int idx = 0; idx < nCases; idx++) {
            tokenizer = new StringTokenizer(reader.readLine());

            int prize = Integer.parseInt(tokenizer.nextToken());
            int nChange = Integer.parseInt(tokenizer.nextToken());

            stringBuilder.append("#" + (idx + 1) + " ");
            executeOne(prize, nChange);
        }

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));
        writer.write(stringBuilder.toString());
        writer.flush();
    }

}
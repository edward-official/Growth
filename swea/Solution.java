import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.StringTokenizer;

public class Solution {

    private static StringBuilder stringBuilder = new StringBuilder();

    private static int getNumber(String item) {
        if (item.equals("ZRO")) return 0;
        if (item.equals("ONE")) return 1;
        if (item.equals("TWO")) return 2;
        if (item.equals("THR")) return 3;
        if (item.equals("FOR")) return 4;
        if (item.equals("FIV")) return 5;
        if (item.equals("SIX")) return 6;
        if (item.equals("SVN")) return 7;
        if (item.equals("EGT")) return 8;
        if (item.equals("NIN")) return 9;

        return -1;
    }

    private static String[] convertToArray(String line, int tcLength) {
        String[] rv = new String[tcLength];

        StringTokenizer tokenizer = new StringTokenizer(line);
        for (int idx = 0; idx < tcLength; idx++) {
            String item = tokenizer.nextToken();
            rv[idx] = item;
        }

        return rv;
    }

    private static void mergesort(String[] arr, int openingIdx, int closingIdx) {
        if (openingIdx == closingIdx) return;

        int middleIdx = openingIdx + (closingIdx - openingIdx) / 2;

        mergesort(arr, openingIdx, middleIdx);
        mergesort(arr, middleIdx + 1, closingIdx);

        String[] tmp = new String[closingIdx - openingIdx + 1];
        int tmpIdx = 0;

        int idxL = openingIdx;
        int idxR = middleIdx + 1;

        while (idxL <= middleIdx && idxR <= closingIdx) {
            int numL = getNumber(arr[idxL]);
            int numR = getNumber(arr[idxR]);

            if (numL < numR) tmp[tmpIdx++] = arr[idxL++];
            else tmp[tmpIdx++] = arr[idxR++];
        }

        while (idxL <= middleIdx) tmp[tmpIdx++] = arr[idxL++];
        while (idxR <= closingIdx) tmp[tmpIdx++] = arr[idxR++];

        for (int offset = 0; offset < tmpIdx; offset++) {
            arr[openingIdx + offset] = tmp[offset];
        }
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));

        int nTc = Integer.parseInt(reader.readLine().trim());
        for (int i = 0; i < nTc; i++) {
            StringTokenizer tokenizer = new StringTokenizer(reader.readLine());

            int tcIdx = Integer.parseInt(tokenizer.nextToken().substring(1));
            int tcLength = Integer.parseInt(tokenizer.nextToken());

            String[] arr = convertToArray(reader.readLine(), tcLength);

            stringBuilder.append("#" + tcIdx).append("\n");

            // sort
            mergesort(arr, 0, tcLength - 1);

            for (String item: arr) {
                stringBuilder.append(item + " ");
            }
            stringBuilder.append("\n");
        }

        writer.write(stringBuilder.toString());
        writer.flush();
    }
}

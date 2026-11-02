import java.io.*;
import java.util.StringTokenizer;

public class Solution {

    private static StringBuilder stringBuilder = new StringBuilder();
    private static int maxTaste = 0;

    private static void handleOne(int[] tArray, int[] cArray, int cLimit, int tNow, int cNow, int idx) {
        if (cNow > cLimit) return;

        if (cNow == cLimit || idx == tArray.length) {
            maxTaste = Math.max(tNow, maxTaste);
            return;
        }

        handleOne(tArray, cArray, cLimit, tNow, cNow, idx + 1);
        handleOne(tArray, cArray, cLimit, tNow + tArray[idx], cNow + cArray[idx], idx + 1);
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer tokenizer = new StringTokenizer(reader.readLine());

        int nInput = Integer.parseInt(tokenizer.nextToken());
        for (int idx = 0; idx < nInput; idx++) {
            tokenizer = new StringTokenizer(reader.readLine());

            int nIngredient = Integer.parseInt(tokenizer.nextToken());
            int cLimit = Integer.parseInt(tokenizer.nextToken());

            int[] tasteArray = new int[nIngredient];
            int[] cArray = new int[nIngredient];

            for (int i = 0; i < nIngredient; i++) {
                tokenizer = new StringTokenizer(reader.readLine());

                tasteArray[i] = Integer.parseInt(tokenizer.nextToken());
                cArray[i] = Integer.parseInt(tokenizer.nextToken());
            }

            maxTaste = 0;
            handleOne(tasteArray, cArray, cLimit, 0, 0, 0);
            stringBuilder.append("#" + (idx + 1) + " " + maxTaste).append("\n");
        }

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));
        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
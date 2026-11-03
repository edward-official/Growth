import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

public class Solution {

    private static StringBuilder stringBuilder = new StringBuilder();
    private static int minGap = Integer.MAX_VALUE;

    private static int getGap(List<Integer> boxHeight) {
        int maxH = boxHeight.get(0);
        int minH = boxHeight.get(0);

        for (int idx = 1; idx < boxHeight.size(); idx++) {
            int item = boxHeight.get(idx);

            maxH = Math.max(item, maxH);
            minH = Math.min(item, minH);
        }

        return maxH - minH;
    }

    private static void flattenOnce(List<Integer> boxHeight) {
        int idxMax = 0;
        int idxMin = 0;

        int n = boxHeight.size();
        for (int idx = 0; idx < n; idx++) {
            if (boxHeight.get(idx) > boxHeight.get(idxMax)) idxMax = idx;
            if (boxHeight.get(idx) < boxHeight.get(idxMin)) idxMin = idx;
        }

        boxHeight.set(idxMax, boxHeight.get(idxMax) - 1);
        boxHeight.set(idxMin, boxHeight.get(idxMin) + 1);
    }

    private static void handleOne(int nDump, List<Integer> boxHeight) {
        minGap = Integer.MAX_VALUE;

        for (int i = 0; i < nDump; i++) {
            if (getGap(boxHeight) == 0) {
                minGap = Math.min(getGap(boxHeight), minGap);
                return;
            }

            flattenOnce(boxHeight);
        }

        minGap = Math.min(getGap(boxHeight), minGap);
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer tokenizer;

        int nGiven = 10;

        for (int i = 0; i < nGiven; i++) {
            tokenizer = new StringTokenizer(reader.readLine());
            int nDump = Integer.parseInt(tokenizer.nextToken());

            tokenizer = new StringTokenizer(reader.readLine());
            List<Integer> boxHeight = new ArrayList<>();
            while (tokenizer.hasMoreTokens()) {
                boxHeight.add(Integer.parseInt(tokenizer.nextToken()));
            }

            handleOne(nDump, boxHeight);
            stringBuilder.append("#" + (i + 1) + " " + minGap).append("\n");
        }

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));
        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
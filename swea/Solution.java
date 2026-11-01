import java.io.*;
import java.util.StringTokenizer;

public class Solution {

    private static int maxPrize = 0;
    private static boolean[][] visited;

    private static void switchTwo(char[] prize, int idxL, int idxR) {
        char tmp = prize[idxL];
        prize[idxL] = prize[idxR];
        prize[idxR] = tmp;
    }

    private static void handleOne(char[] prize, int nSwitch, int count) {
        int pValue = Integer.parseInt(new String(prize));

        if (count == nSwitch) {
            maxPrize = Math.max(maxPrize, pValue);
            return;
        }

        if (visited[count][pValue]) return;

        visited[count][pValue] = true;
        for (int idxL = 0; idxL < prize.length; idxL++) {
            for (int idxR = idxL + 1; idxR < prize.length; idxR++) {
                switchTwo(prize, idxL, idxR);
                handleOne(prize, nSwitch, count + 1);
                switchTwo(prize, idxL, idxR);
            }
        }
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer tokenizer = new StringTokenizer(reader.readLine());

        StringBuilder stringBuilder = new StringBuilder();

        int nGiven = Integer.parseInt(tokenizer.nextToken());
        for (int idx = 0; idx < nGiven; idx++) {
            tokenizer = new StringTokenizer(reader.readLine());

            String prize = tokenizer.nextToken();
            int nSwitch = Integer.parseInt(tokenizer.nextToken());

            maxPrize = 0;
            visited = new boolean[nSwitch][Integer.parseInt(prize) * 10];
            handleOne(prize.toCharArray(), nSwitch, 0);

            stringBuilder.append("#" + (idx + 1) + " " + maxPrize).append("\n");
        }

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));
        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
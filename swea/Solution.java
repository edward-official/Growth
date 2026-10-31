import java.io.*;
import java.util.StringTokenizer;

public class Solution {

    private static StringBuilder stringBuilder = new StringBuilder();

    private static void executeOne(int n, int[] arr) {
        int countRoom = 0;

        for (int idx = 0; idx < n; idx++) {
            int left1 = (idx - 2 >= 0) ? arr[idx - 2] : 0;
            int left2 = (idx - 1 >= 0) ? arr[idx - 1] : 0;
            int right1 = (idx + 1 < n) ? arr[idx + 1] : 0;
            int right2 = (idx + 2 < n) ? arr[idx + 2] : 0;
            int maxSurround = Math.max(Math.max(left1, left2), Math.max(right1, right2));

            countRoom += (arr[idx] > maxSurround) ? (arr[idx] - maxSurround) : 0;
        }

        stringBuilder.append(countRoom).append("\n");
        return;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));

        String line;
        StringTokenizer tokenizer;

        for (int tcIdx = 0; tcIdx < 10; tcIdx++) {
            stringBuilder.append("#" + (tcIdx + 1) + " ");
            line = reader.readLine();
            tokenizer = new StringTokenizer(line);

            int n = Integer.parseInt(tokenizer.nextToken());
            int[] arr = new int[n];

            line = reader.readLine();
            tokenizer = new StringTokenizer(line);
            for (int idx = 0; idx < n; idx++) {
                arr[idx] = Integer.parseInt(tokenizer.nextToken());
            }

            executeOne(n, arr);
        }

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));
        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
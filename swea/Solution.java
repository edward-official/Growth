import java.io.*;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.StringTokenizer;

public class Solution {

    private static final int CODE_LENGTH = 8;
    private static final int N_TC = 10;
    private static final int ROTATION_LENGTH = 5;

    private static StringBuilder stringBuilder = new StringBuilder();

    private static void decode(Deque<Integer> code) {
        int subtracter = 1;

        while (true) {
            int fixedItem = code.poll() - subtracter;
            subtracter = subtracter % ROTATION_LENGTH + 1;
            code.offer(Math.max(fixedItem, 0));

            if (fixedItem <= 0) break;
        }
    }

    private static String oneTc(Deque<Integer> code) {
        StringBuilder answer = new StringBuilder();

        decode(code);
        while (!code.isEmpty()) {
            answer.append(" " + code.poll());
        }

        return answer.toString();
    }

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));

        for (int i = 0; i < N_TC; i++) {
            StringTokenizer tokenizer = new StringTokenizer(reader.readLine());
            int tc = Integer.parseInt(tokenizer.nextToken());

            tokenizer = new StringTokenizer(reader.readLine());
            Deque<Integer> code = new ArrayDeque<>();
            for (int idx = 0; idx < CODE_LENGTH; idx++) {
                code.add(Integer.parseInt(tokenizer.nextToken()));
            }

            stringBuilder.append("#" + tc + oneTc(code)).append("\n");
        }

        writer.write(stringBuilder.toString());
        writer.flush();
    }
}
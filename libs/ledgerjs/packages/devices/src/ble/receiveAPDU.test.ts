import { from } from "rxjs";
import { receiveAPDU } from "./receiveAPDU";

describe("receiveAPDU", () => {
  const tests = [
    // 1. Response from a get version
    {
      input: [
        Buffer.from([
          ...[0x05, 0, 0, 0, 0x1f], // Tag, frame id and message length (2 bytes)
          ...[
            0x33, 0x20, 0x00, 0x04, 0x05, 0x31, 0x2e, 0x33, 0x2e, 0x30, 0x04, 0xe6, 0x02, 0x00,
            0x00, 0x04, 0x35, 0x2e, 0x32, 0x34, 0x04, 0x30, 0x2e, 0x34, 0x38, 0x01, 0x00, 0x01,
            0x00, 0x90, 0x00,
          ],
          // No 0-padding
        ]),
      ],
      expectedOutput: Buffer.from([
        0x33, 0x20, 0x00, 0x04, 0x05, 0x31, 0x2e, 0x33, 0x2e, 0x30, 0x04, 0xe6, 0x02, 0x00, 0x00,
        0x04, 0x35, 0x2e, 0x32, 0x34, 0x04, 0x30, 0x2e, 0x34, 0x38, 0x01, 0x00, 0x01, 0x00, 0x90,
        0x00,
      ]),
    },
    // 2. Response from a get device (long) name
    {
      input: [
        // 1st frame
        Buffer.from([
          ...[0x05, 0, 0, 0, 0x42], // Tag, frame id and message length (2 bytes)
          ...[
            0x54, 0x6f, 0x66, 0x75, 0x49, 0x73, 0x4e, 0x75, 0x74, 0x72, 0x69, 0x74, 0x69, 0x6f,
            0x75, 0x73, 0x41, 0x6e, 0x64, 0x42, 0x72, 0x69, 0x6e, 0x67, 0x73, 0x4a, 0x6f, 0x79,
            0x44, 0x65, 0x6c, 0x69, 0x67, 0x68, 0x74, 0x48, 0x65, 0x61, 0x6c, 0x74, 0x68, 0x69,
            0x6e, 0x65, 0x73, 0x73, 0x48, 0x61, 0x72, 0x6d, 0x6f, 0x6e, 0x79, 0x49, 0x6e, 0x45,
            0x76, 0x65, 0x72,
          ],
        ]),
        // 2nd frame
        Buffer.from([
          ...[0x05, 0, 0x01], // Tag and frame id
          ...[0x79, 0x42, 0x69, 0x74, 0x65, 0x90, 0x00],
          // No 0-padding
        ]),
      ],
      expectedOutput: Buffer.from([
        0x54, 0x6f, 0x66, 0x75, 0x49, 0x73, 0x4e, 0x75, 0x74, 0x72, 0x69, 0x74, 0x69, 0x6f, 0x75,
        0x73, 0x41, 0x6e, 0x64, 0x42, 0x72, 0x69, 0x6e, 0x67, 0x73, 0x4a, 0x6f, 0x79, 0x44, 0x65,
        0x6c, 0x69, 0x67, 0x68, 0x74, 0x48, 0x65, 0x61, 0x6c, 0x74, 0x68, 0x69, 0x6e, 0x65, 0x73,
        0x73, 0x48, 0x61, 0x72, 0x6d, 0x6f, 0x6e, 0x79, 0x49, 0x6e, 0x45, 0x76, 0x65, 0x72, 0x79,
        0x42, 0x69, 0x74, 0x65, 0x90, 0x00,
      ]),
    },
    // 3. A device that went rogue and is sending multiple time the same response, while only 1 frame is expected
    {
      input: [
        Buffer.from([
          ...[0x05, 0, 0, 0, 0x1f], // Tag, frame id and message length (2 bytes)
          ...[
            0x33, 0x20, 0x00, 0x04, 0x05, 0x31, 0x2e, 0x33, 0x2e, 0x30, 0x04, 0xe6, 0x02, 0x00,
            0x00, 0x04, 0x35, 0x2e, 0x32, 0x34, 0x04, 0x30, 0x2e, 0x34, 0x38, 0x01, 0x00, 0x01,
            0x00, 0x90, 0x00,
          ],
          // No 0-padding
        ]),
        Buffer.from([
          ...[0x05, 0, 0, 0, 0x1f], // Tag, frame id and message length (2 bytes)
          ...[
            0x33, 0x20, 0x00, 0x04, 0x05, 0x31, 0x2e, 0x33, 0x2e, 0x30, 0x04, 0xe6, 0x02, 0x00,
            0x00, 0x04, 0x35, 0x2e, 0x32, 0x34, 0x04, 0x30, 0x2e, 0x34, 0x38, 0x01, 0x00, 0x01,
            0x00, 0x90, 0x00,
          ],
          // No 0-padding
        ]),
        Buffer.from([
          ...[0x05, 0, 0, 0, 0x1f], // Tag, frame id and message length (2 bytes)
          ...[
            0x33, 0x20, 0x00, 0x04, 0x05, 0x31, 0x2e, 0x33, 0x2e, 0x30, 0x04, 0xe6, 0x02, 0x00,
            0x00, 0x04, 0x35, 0x2e, 0x32, 0x34, 0x04, 0x30, 0x2e, 0x34, 0x38, 0x01, 0x00, 0x01,
            0x00, 0x90, 0x00,
          ],
          // No 0-padding
        ]),
      ],
      // Only 1 response should be recorded, as only 1 frame was set in the 1st frame of the response
      expectedOutput: Buffer.from([
        0x33, 0x20, 0x00, 0x04, 0x05, 0x31, 0x2e, 0x33, 0x2e, 0x30, 0x04, 0xe6, 0x02, 0x00, 0x00,
        0x04, 0x35, 0x2e, 0x32, 0x34, 0x04, 0x30, 0x2e, 0x34, 0x38, 0x01, 0x00, 0x01, 0x00, 0x90,
        0x00,
      ]),
    },
  ];

  tests.forEach(({ input, expectedOutput }) => {
    test(`Input: ${JSON.stringify(input)} -> Expected output: ${JSON.stringify(
      expectedOutput,
    )}`, done => {
      const rawStream = from(input);

      receiveAPDU(rawStream).subscribe({
        error: error => {
          done(`An error should not occur: ${error}`);
        },
        next: result => {
          try {
            expect(result).toEqual(expectedOutput);
            done();
          } catch (error) {
            done(error);
            return;
          }
        },
      });
    });
  });
});

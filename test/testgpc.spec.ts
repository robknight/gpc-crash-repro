import { GPCProofConfig, gpcProve } from "@pcd/gpc";
import { POD } from "@pcd/pod";
import { describe, it } from "vitest";
import path from "path";

describe("testgpc", () => {
  const GPC_TEST_ARTIFACTS_PATH = path.join(__dirname, "../node_modules/@pcd/proto-pod-gpc-artifacts");
  it("testing", async function () {
    const pod1 = POD.deserialize(
      '{"entries":{"bar":{"type":"int","value":10},"foo":{"type":"string","value":"bbbbbb"}},"signature":"8a+rZb9A5iFmXqFp1NAM50NCtev4W3uzdEQqze115w6De4vhly4svENdE8qudENao7WLYOOixk2QQh46ND+pAA","signerPublicKey":"4d7qjNQu/THOf7UWriK5kOrorcIDXbh1R7gahBpM+iA"}'
    );
    const pod2 = POD.deserialize(
      '{"entries":{"baz":{"type":"cryptographic","value":1000},"quux":{"type":"string","value":"magic"}},"signature":"i/jAEMt6M07CSwNzGSBUG8s1C5V6S1zpYzgE8Nalr6lUigjeIyuSS6fGN7vLvkdEN56tQ9H5e8Ii335qJLrcAQ","signerPublicKey":"4d7qjNQu/THOf7UWriK5kOrorcIDXbh1R7gahBpM+iA"}'
    );

    const proofConfig: GPCProofConfig = {
      pods: {
        pod1: {
          entries: {
            foo: {
              isRevealed: true,
              isMemberOf: undefined,
              isNotMemberOf: undefined
            },
            bar: {
              isRevealed: true,
              isMemberOf: undefined,
              isNotMemberOf: undefined,
              inRange: { min: 0n, max: 10n }
            }
          }
        },
        pod2: {
          entries: {
            baz: {
              isRevealed: true,
              isMemberOf: undefined,
              isNotMemberOf: undefined,
              inRange: undefined
            },
            quux: {
              isRevealed: false,
              isMemberOf: "allowlist_pod2_quux",
              isNotMemberOf: undefined
            }
          }
        }
      },
      tuples: {}
    };

    const result = await gpcProve(
      proofConfig,
      {
        pods: {
          pod1,
          pod2
        },
        membershipLists: {
          allowlist_pod2_quux: [{ type: "string", value: "magic" }]
        }
      },
      GPC_TEST_ARTIFACTS_PATH
    );

    console.log(result);
  });
});
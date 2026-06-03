import { describe, expect, test } from "vitest";
import { AccessLevel, TokenGenerator } from "./token-generator.ts";

describe("Token Generator", () => {
  describe("setPermissions", () => {
    test("attempt to set an invalid access level", () => {
      const tokenGenerator = new TokenGenerator();
      expect(() =>
        tokenGenerator.setPermissions("contents", AccessLevel.admin),
      ).toThrow("Invalid access level requested");
    });
  });

  describe("toUrl", () => {
    test("no parameters", () => {
      const tokenGenerator = new TokenGenerator();
      expect(tokenGenerator.toUrl()).toBe(
        "https://github.com/settings/personal-access-tokens/new",
      );
    });

    test("all parameters", () => {
      const tokenGenerator = new TokenGenerator();
      tokenGenerator
        .setName("The name")
        .setDescription("The description which is longer")
        .setExpiresIn(0)
        .setTargetName("my-organisation")
        .setPermissions("repository_custom_properties", AccessLevel.read)
        .setPermissions("contents", AccessLevel.write);

      expect(tokenGenerator.toUrl()).toBe(
        "https://github.com/settings/personal-access-tokens/new?name=The+name&description=The+description+which+is+longer&target_name=my-organisation&expires_in=none&repository_custom_properties=read&contents=write",
      );
    });
  });
});

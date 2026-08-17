import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const cardFiles = [
  "cards_filled.json",
  "cards_jp.json",
  "hidden_words_zh.json",
  "hidden_words_jp.json",
  "hidden_words_en.json",
  "hidden_words_kr.json"
];

const hiddenWordFiles = [
  "hidden_words_zh.json",
  "hidden_words_jp.json",
  "hidden_words_en.json",
  "hidden_words_kr.json"
];

const questionFiles = [
  "questions.json",
  "questions_jp.json",
  "questions_en.json",
  "questions_kr.json"
];

async function loadJson(relativePath) {
  const source = await readFile(resolve(siteRoot, relativePath), "utf8");
  return JSON.parse(source);
}

function assertNonEmptyString(value, message) {
  assert.equal(typeof value, "string", message);
  assert.ok(value.trim().length > 0, message);
}

function assertUniqueIds(records, file) {
  const ids = records.map(record => String(record.id));
  assert.equal(new Set(ids).size, ids.length, `${file} contains duplicate IDs`);
}

for (const file of cardFiles) {
  test(`${file} contains valid card records`, async () => {
    const records = await loadJson(file);
    assert.ok(Array.isArray(records), `${file} must contain a JSON array`);
    assert.ok(records.length > 0, `${file} must not be empty`);
    assertUniqueIds(records, file);

    for (const [index, card] of records.entries()) {
      const location = `${file}[${index}]`;
      assert.ok(card && typeof card === "object" && !Array.isArray(card), `${location} must be an object`);
      assert.ok(card.id !== undefined && card.id !== null && card.id !== "", `${location}.id is required`);
      assertNonEmptyString(card.name, `${location}.name must be a non-empty string`);
      assertNonEmptyString(card.description, `${location}.description must be a non-empty string`);

      if (card.image !== undefined) {
        assertNonEmptyString(card.image, `${location}.image must be a non-empty string`);
        await access(resolve(siteRoot, "imgs", card.image));
      }
    }
  });
}

for (const file of questionFiles) {
  test(`${file} contains valid question records`, async () => {
    const records = await loadJson(file);
    assert.ok(Array.isArray(records), `${file} must contain a JSON array`);
    assert.ok(records.length > 0, `${file} must not be empty`);
    assertUniqueIds(records, file);

    for (const [index, question] of records.entries()) {
      const location = `${file}[${index}]`;
      assert.ok(question && typeof question === "object" && !Array.isArray(question), `${location} must be an object`);
      assert.ok(question.id !== undefined && question.id !== null && question.id !== "", `${location}.id is required`);
      assertNonEmptyString(question.category, `${location}.category must be a non-empty string`);
      assertNonEmptyString(question.question, `${location}.question must be a non-empty string`);
      assert.ok(Array.isArray(question.keywords), `${location}.keywords must be an array`);
      assert.ok(question.keywords.length > 0, `${location}.keywords must not be empty`);
      question.keywords.forEach((keyword, keywordIndex) => {
        assertNonEmptyString(keyword, `${location}.keywords[${keywordIndex}] must be a non-empty string`);
      });

      if (question.resource !== undefined) {
        assertNonEmptyString(question.resource, `${location}.resource must be a non-empty string`);
      }
    }
  });
}

test("Hidden Words language files contain the same IDs", async () => {
  const languagePacks = await Promise.all(hiddenWordFiles.map(loadJson));
  const expectedIds = languagePacks[0].map(record => String(record.id));

  hiddenWordFiles.slice(1).forEach((file, index) => {
    const actualIds = languagePacks[index + 1].map(record => String(record.id));
    assert.deepEqual(actualIds, expectedIds, `${file} IDs do not match ${hiddenWordFiles[0]}`);
  });
});

test("Question language files contain the same IDs", async () => {
  const languagePacks = await Promise.all(questionFiles.map(loadJson));
  const expectedIds = languagePacks[0].map(record => String(record.id));

  questionFiles.slice(1).forEach((file, index) => {
    const actualIds = languagePacks[index + 1].map(record => String(record.id));
    assert.deepEqual(actualIds, expectedIds, `${file} IDs do not match ${questionFiles[0]}`);
  });
});

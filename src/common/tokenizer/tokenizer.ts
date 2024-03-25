import * as WinkTokenizer from 'wink-tokenizer';
import { Token as WinkToken } from 'wink-tokenizer';

export type Token = {
  word: string;
  tag: string;
  charStart: number;
  charEnd: number;
};

export class Tokenizer {
  private readonly tokenizer = new WinkTokenizer();
  public tokenize(text: string): Token[] {
    const tokens = this.tokenizer.tokenize(text);
    const bounds = getBounds(text, tokens);
    return tokens.map((t, i) => ({
      word: t.value,
      tag: t.tag,
      charStart: bounds[i].charStart,
      charEnd: bounds[i].charEnd,
    }));
  }
}

const getBounds = (
  referenceText: string,
  referenceWords: WinkToken[],
): { charStart: number; charEnd: number }[] => {
  // for each word, get position in text
  const bounds = [];
  let charStart = 0;
  for (const word of referenceWords) {
    charStart = referenceText.indexOf(word.value, charStart);
    if (charStart < 0) {
      break; // fail all
    }
    const charEnd = charStart + word.value.length;
    bounds.push({ charStart, charEnd });
    charStart = charEnd;
  }
  return bounds;
};

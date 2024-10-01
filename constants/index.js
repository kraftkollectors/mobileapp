//"softwareKeyboardLayoutMode": "pan"

import { FORBIDDEN_WORDS } from "./json";

//text field filters
export const isEmpty = (input, label, throwErr) => {
  if (input.trim() === "") {
    throwErr(`${label} can not be left blank`);
    return true;
  }

  return false;
};

export const is_less_than_min = (min, input, label, throwErr) => {
  if (input?.trim()?.length < Number(min)) {
    throwErr(`${label} can not be less than ${min} characters`);
    return true;
  }

  return false;
};

export const has_less_words = (count, input, label, throwErr) => {
  if (input.trim()?.split(" ")?.length < count) {
    throwErr(`${label} must be atleast ${count} words long`);
    return true;
  }

  return false;
};

export const contains_forbidden_words = (input, label, throwErr) => {
  let wordsArr = Object.values(FORBIDDEN_WORDS);

  try {
    wordsArr.forEach((word) => {
      if (input.toLowerCase().includes(word)) {
        throwErr(
          `${label} may contain word(s) that conflicts with our policies. Please check and remove appropriately`
        );
        throw new Error("Break loop. match found");
      }
    });

    //no match
    return false;
  } catch (error) {
    return true;
  }

  return false;
};

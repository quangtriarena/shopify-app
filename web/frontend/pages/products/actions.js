export const generateVariantsFromOptions = (options) => {
  let variants = []

  let option1 = options[0] || null
  let option2 = options[1] || null
  let option3 = options[2] || null

  if (option3?.values?.length) {
    for (let i = 0; i < option1.values.length; i++) {
      for (let j = 0; j < option2.values.length; j++) {
        for (let k = 0; k < option3.values.length; k++) {
          variants.push({
            option1: option1.values[i],
            option2: option2.values[j],
            option3: option3.values[k],
          })
        }
      }
    }
  } else if (option2?.values?.length) {
    for (let i = 0; i < option1.values.length; i++) {
      for (let j = 0; j < option2.values.length; j++) {
        variants.push({
          option1: option1.values[i],
          option2: option2.values[j],
        })
      }
    }
  } else {
    for (let i = 0; i < option1.values.length; i++) {
      variants.push({
        option1: option1.values[i],
      })
    }
  }

  return variants
}

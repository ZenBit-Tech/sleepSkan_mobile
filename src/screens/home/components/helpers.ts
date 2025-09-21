import { useTranslation } from "react-i18next"
import { COFFEE_VARIANTS, SLEEP_VARIANTS, TOBACCO_VARIANTS } from "src/models"
import { colors } from "src/theme"

 export const getCoffeeColor = (coffee: COFFEE_VARIANTS | undefined) => {
    if (coffee === COFFEE_VARIANTS.SMALL) {
      return colors.green
    } else if (coffee === COFFEE_VARIANTS.MEDIUM) {
      return colors.yellow
    } else if (coffee === COFFEE_VARIANTS.ALOT) {
      return colors.red
    } else {
      return 'transparant'
    }
  }

 export const getCoffeeDescr = (coffee: COFFEE_VARIANTS | undefined) => {
    if (coffee === COFFEE_VARIANTS.SMALL) {
      return 'home.greenCoffeeDescr'
    } else if (coffee === COFFEE_VARIANTS.MEDIUM) {
      return 'home.yellowCoffeeDescr'
    } else if (coffee === COFFEE_VARIANTS.ALOT) {
      return 'home.redCoffeeDescr'
    } else {
      return ''
    }
  }
  export const getTobaccoColor = (tobacco: TOBACCO_VARIANTS | undefined) => {
    if (tobacco === TOBACCO_VARIANTS.NO) {
      return colors.green
    } else if (tobacco === TOBACCO_VARIANTS.EX_SMOKER) {
      return colors.yellow
    } else if (tobacco === TOBACCO_VARIANTS.YES) {
      return colors.red
    } else {
      return 'transparant'
    }
  }
  export const getTobaccoDescr = (tobacco: TOBACCO_VARIANTS | undefined) => {
    if (tobacco === TOBACCO_VARIANTS.NO) {
      return 'home.greenTobaccoDescr'
    } else if (tobacco === TOBACCO_VARIANTS.EX_SMOKER) {
      return 'home.yellowTobaccoDescr'
    } else if (tobacco === TOBACCO_VARIANTS.YES) {
      return 'home.redTobaccoDescr'
    } else {
      return ''
    }
  }
  export const getSleepColor = (sleep: SLEEP_VARIANTS | undefined) => {
    if (sleep === SLEEP_VARIANTS.ENOUGH) {
      return colors.green
    } else if (sleep === SLEEP_VARIANTS.NOT_ENOUGH) {
      return colors.red
    } else if (sleep ===SLEEP_VARIANTS.TOO_MUCH) {
      return colors.yellow
    } else {
      return 'transparant'
    }
  }
  export const getSleepDescr = (sleep: SLEEP_VARIANTS | undefined) => {
    if (sleep === SLEEP_VARIANTS.ENOUGH) {
      return 'home.greenSleepDescr'
    } else if (sleep === SLEEP_VARIANTS.NOT_ENOUGH) {
      return 'home.redSleepDescr'
    } else if (sleep ===SLEEP_VARIANTS.TOO_MUCH) {
      return 'home.yellowSleepDescr'
    } else {
      return ''
    }
  }
  export const getAlcoholColor = (alcohol1: boolean | undefined, alcohol2: boolean | undefined) => {
    if (!alcohol1 && !alcohol2) {
      return colors.green
    } else if (alcohol1 && alcohol2) {
      return colors.red
    } else {
      return colors.yellow
    }
  }
  export const getAlcoholDescr1 = (alcohol1: boolean | undefined) => {
    if (alcohol1) {
      return 'home.redAlcohol1'
    } else {
      return 'home.greenAlcohol1'
    }
  }
  export const getAlcoholDescr2 = (alcohol2: boolean | undefined) => {
    if (alcohol2) {
      return 'home.redAlcohol2'
    } else {
      return 'home.greenAlcohol2'
    }
  }

  export const getWeightColor = (weight: number | undefined) => {
    if (weight && weight>8.5 && weight < 24.9) {
      return colors.green
    } else if (weight && (weight < 18.5 || (weight> 25 && weight <= 29))) {
      return colors.yellow
    } else if (weight && weight >  29) {
      return colors.red
    } else {
      return 'transparant'
    }
  }

  export const getWeightDescr = (weight: number | undefined) => {
    if (weight && weight>18.5 && weight < 24.9) {
      return 'home.greenWeightDescr'
    } else if (weight && (weight < 18.5)) {
      return 'home.yellow1WeightDescr'
    } else if (weight && (weight> 25 && weight <= 29.9)) {
      return 'home.yellow2WeightDescr'
    } else if (weight && weight >  29.9) {
      return 'home.redWeightDescr'
    } else {
      return 'transparant'
    }
  }

  export const getRiskColor = (risk: number | undefined) => {
    if (risk && risk <= 2) {
      return colors.green
    } else if (risk && risk > 2 && risk <= 4) {
      return colors.yellow
    } else if (risk && risk > 4) {
      return colors.red
    } else {
      return 'transparant'
    }
  }

  export const getRiskText = (risk: number | undefined) => {
     if (risk && risk <= 2) {
      return 'home.lowRisk'
    } else if (risk && risk > 2 && risk <= 4) {
      return 'home.intermediateRisk'
    } else if (risk && risk > 4) {
      return 'home.highRisk'
    } else {
      return ''
    }
  }

  export const getRiskSubText = (risk: number | undefined) => {
     if (risk && risk <= 2) {
      return 'home.lowText'
    } else if (risk && risk > 2 && risk <= 4) {
      return 'home.intermediateText'
    } else if (risk && risk > 4) {
      return 'home.highText'
    } else {
      return ''
    }
  }

  export const getRiskDescriptiont = (risk: number | undefined, cardName: 'tobacco' | 'sleep' | 'coffee' | 'alcohol' | 'medicine' | 'weight') => {
     if (risk && risk <= 2) {
      return 'home.lowText'
    } else if (risk && risk > 2 && risk <= 4) {
      return 'home.intermediateText'
    } else if (risk && risk > 4) {
      return 'home.highText'
    } else {
      return ''
    }
  }
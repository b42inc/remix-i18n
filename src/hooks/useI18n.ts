import { useContext } from 'react'
import { I18nContext, I18nContextProps } from '../context/I18n'

export const useI18n = <T extends readonly string[] = []>() =>
  useContext(I18nContext) as unknown as I18nContextProps<T>

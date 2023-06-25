import { useContext } from 'react'
import { I18nContext } from '../context/I18n'

export const useI18n = () => useContext(I18nContext)

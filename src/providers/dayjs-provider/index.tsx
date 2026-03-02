"use client";

import { useLocale } from "next-intl";
import dayjs from "@/lib/dayjs";

import "dayjs/locale/ko";
import "dayjs/locale/en";
import "dayjs/locale/bn";
import "dayjs/locale/hi";

interface DayjsProviderPropsType {
  children: React.ReactNode;
}

const DayjsProvider = ({ children }: DayjsProviderPropsType) => {
  const locale = useLocale();
  dayjs.locale(locale);

  return <>{children}</>;
};

export default DayjsProvider;

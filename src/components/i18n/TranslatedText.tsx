import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface TranslatedTextProps {
  children: string;
}

export const TranslatedText = ({ children }: TranslatedTextProps) => {
  const { language, translate, getCachedTranslation } = useLanguage();
  const [text, setText] = useState<string>(
    () => getCachedTranslation(children) || children
  );

  useEffect(() => {
    let active = true;
    const maybeCached = getCachedTranslation(children);
    if (maybeCached) {
      setText(maybeCached);
      return;
    }
    translate(children).then((t) => {
      if (active) setText(t);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, language]);

  return <>{text}</>;
};

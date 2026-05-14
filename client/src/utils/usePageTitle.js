import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | Billify`;
  }, [title]);
};

export default usePageTitle;

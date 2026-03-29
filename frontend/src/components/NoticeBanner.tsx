import type { Notice } from "../types";

type NoticeBannerProps = {
  notice: Notice | null;
};

export function NoticeBanner({ notice }: NoticeBannerProps) {
  if (!notice) return null;
  return (
    <p className={notice.type === "error" ? "notice error" : "notice success"}>
      {notice.text}
    </p>
  );
}

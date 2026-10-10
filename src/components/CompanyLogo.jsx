import { getInitials, getLogoColor } from "../utils/helpers";

export default function CompanyLogo({ name }) {
  return (
    <div
      className="company-logo"
      style={{ background: getLogoColor(name) }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
/* Page: Legal - BusinessAddress */
import { BUSINESS } from "../legalDetails";

/** The contracting party and data controller, as an address block. */
export default function BusinessAddress({ email = BUSINESS.support }) {
  return (
    <address className="not-italic text-espresso">
      {BUSINESS.name}
      <br />
      Owner: {BUSINESS.owner}
      {BUSINESS.address.map((line) => (
        <span key={line}>
          <br />
          {line}
        </span>
      ))}
      <br />
      Email: <a href={`mailto:${email}`}>{email}</a>
    </address>
  );
}

import PaperStamp from "../paper/PaperStamp.jsx";

const tone = {
  pending: "kraft",
  shipped: "blue",
  delivered: "green",
  cancelled: "red",
  paid: "green",
};

/** Status is always spelled out — colour alone never carries the meaning. */
export default function StatusStamp({ status, className }) {
  return (
    <PaperStamp tone={tone[status] || "ink"} className={className}>
      {status}
    </PaperStamp>
  );
}

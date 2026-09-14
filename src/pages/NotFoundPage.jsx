import { Link } from "@tanstack/react-router";
import PaperEmptyState from "../components/paper/PaperEmptyState.jsx";
import PaperButton from "../components/paper/PaperButton.jsx";

export default function NotFoundPage() {
  return (
    <div className="py-10">
      <PaperEmptyState
        title="Nothing on this desk"
        hint="That page was never filed here, or it has already been thrown in the bin."
        action={
          <PaperButton as={Link} to="/login" variant="stamp">
            Back to the day book
          </PaperButton>
        }
      />
    </div>
  );
}

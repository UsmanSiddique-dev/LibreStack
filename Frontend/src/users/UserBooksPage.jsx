import React from "react";
import { userBooksPageStyles as s } from "../assets/Styles";
import { Search } from "lucide-react";
const UserBooksPage = () => {
  return (
    <div className={s.pageContainer}>
      <section className={s.heroSection}>
        <div className={s.heroFlex}>
          <div>
            <span className={s.heroBadge}>Students Books Page</span>
            <h1 className={s.heroTitle}>
              Book Cards with richer content and cleaner groupeddetails.
            </h1>
            <p className={s.heroText}>
              Each card now uses a clearer top summary , status badge, content
              chips, and a better medium-card layout so the details feel
              structured and and elegant.
            </p>
          </div>
        </div>
      </section>
      <section className={s.mainSection}>
        <div className={s.sectionHeader}>
          <div>
            <h2 className={s.sectionTitle}>My Issued Books</h2>
            <p className={s.sectionSubtitle}>
              Medium-size cards now separate the headline details from the
              supporting record data.
            </p>
          </div>
        </div>
        <div className={s.filtersContainer}>
          <label htmlFor="" className={s.filterLabel}>
            <span className={s.filterLabelSpan}>Search My Books</span>
            <div className={s.searchWrapper}>
              <Search size={14} className={s.searchIcon} />
            </div>
          </label>
        </div>
      </section>
    </div>
  );
};

export default UserBooksPage;

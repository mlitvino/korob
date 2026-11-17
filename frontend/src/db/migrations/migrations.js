import journal from './meta/_journal.json';
import m0000 from './0000_same_exiles.sql';
import m0001 from './0001_add_updated_at.sql';
import m0002 from './0002_add_currency.sql';
import m0003 from './0003_add_occurred_at.sql';
import m0004 from './0004_add_categories.sql';
import m0005 from './0005_amounts_to_cents.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005
    }
  }
  
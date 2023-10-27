const dayjs = require('dayjs');
require('dayjs/locale/fr'); // Import correct

dayjs.locale('fr'); // Utiliser la locale française

function formatDate(date) {
    return dayjs(date).format('DD/MM/YYYY'); // formate la date en format français
}

module.exports = {
    formatDate
};

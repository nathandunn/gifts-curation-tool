import decode from 'jwt-decode';

export const formatLargeNumber = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatStatusName = name => {
  switch (name) {
    case 'UNDER_REVIEW':
        return 'Under review';
    case 'NOT_REVIEWED':
        return 'Not reviewed';
    case 'REVIEWED':
        return 'Reviewed';
    case 'REJECTED':
        return 'Rejected';
    default:
        return 'Not reviewed';
  }
};

export const isTokenExpired = token => {
  const decoded = decode(token);
  const utcNow = parseInt(new Date().getTime() / 1000, 10);

  return (decoded.exp - utcNow <= 0);
}

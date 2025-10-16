export const formatRupiah = (number: number, options?: Intl.NumberFormatOptions) => {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  return new Intl.NumberFormat('id-ID', { ...defaultOptions, ...options }).format(number);
};

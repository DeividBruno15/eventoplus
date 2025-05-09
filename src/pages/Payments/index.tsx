
import { PaymentHistory } from './components/PaymentHistory';

const PaymentsPage = () => {
  return (
    <div className="container py-6 md:py-10">
      <h1 className="text-2xl font-bold mb-6">Pagamentos</h1>
      <div className="space-y-8">
        <PaymentHistory />
      </div>
    </div>
  );
};

export default PaymentsPage;

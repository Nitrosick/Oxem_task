import { useEffect, useState } from 'react';
import './App.css';
import { Button } from './components/Button/Button';
import { Range } from './components/Range/Range';
import { RangePercent } from './components/RangePercent/RangePercent';
import { config } from './config';

export const App = () => {
  const [cost, setCost] = useState(config.defaults.cost);
  const [contribution, setContribution] = useState(0);
  const [percent, setPercent] = useState(config.defaults.percent);
  const [term, setTerm] = useState(config.defaults.term);
  const [sum, setSum] = useState(0);
  const [payment, setPayment] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendRequest = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setButtonDisabled(true);
    setLoading(true);

    const body = {
      "car_coast": cost,
      "initail_payment": contribution,
      "initail_payment_percent": percent,
      "lease_term": term,
      "total_sum": sum,
      "monthly_payment_from": payment
    }

    try {
        let response = await fetch(config.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (response.status >= 200 && response.status < 300) {
          console.log(response.json());
        }
    } catch (error) {
        console.error('Ошибка: ' + error);
    }

    setTimeout(() => {
      setDisabled(false);
      setButtonDisabled(false);
      setLoading(false);
      // Имитация задержки
    }, 2000);

    // setDisabled(false);
    // setButtonDisabled(false);
    // setLoading(false);
  };

  useEffect(() => {
    if (
      cost > config.max.cost ||
      cost < config.min.cost ||
      percent > config.max.percent ||
      percent < config.min.percent ||
      term > config.max.term ||
      term < config.min.term
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);

      setContribution((cost / 100) * percent);
      setSum(contribution + term * payment);
      setPayment((cost - contribution) * ((config.bet * Math.pow((1 + config.bet), term)) / (Math.pow((1 + config.bet), term) - 1)));
    }
  }, [setContribution, setSum, setPayment, cost, percent, contribution, term, payment]);

  return (
    <form
      className="calculator"
      action="#"
      onSubmit={(e) => { sendRequest(e) }}
    >
      <h1 className="calculator_title">
        Рассчитайте стоимость<br />
        автомобиля в лизинг
      </h1>

      <div className="calculator_values">
        <Range
          title={'Стоимость автомобиля'}
          value={cost}
          setValue={setCost}
          min={config.min.cost}
          max={config.max.cost}
          type={'cost'}
          measure={'₽'}
          disabled={disabled}
        />

        <RangePercent
          title={'Первоначальный взнос'}
          value={contribution}
          setValue={setPercent}
          min={config.min.percent}
          max={config.max.percent}
          type={'contribution'}
          measure={'₽'}
          percent={percent}
          disabled={disabled}
        />

        <Range
          title={'Срок лизинга'}
          value={term}
          setValue={setTerm}
          min={config.min.term}
          max={config.max.term}
          type={'term'}
          measure={'мес.'}
          disabled={disabled}
        />

        <div className="calculator_results">
          <div className="calculator_results_item">
            <span className="subtitle">Сумма договора лизинга</span>
            <span className="calculator_results_value">{ new Intl.NumberFormat("ru", {style: "decimal"}).format(Math.round(sum)) } ₽</span>
          </div>

          <div className="calculator_results_item">
            <span className="subtitle">Ежемесячный платеж от</span>
            <span className="calculator_results_value">{ new Intl.NumberFormat("ru", {style: "decimal"}).format(Math.round(payment)) } ₽</span>
          </div>
        </div>

        <Button
          text={'Оставить заявку'}
          disabled={buttonDisabled}
          loading={loading}
        />
      </div>
    </form>
  );
};

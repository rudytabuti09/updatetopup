import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    {
      id: 1,
      title: 'Pilih Game',
      icon: 'Gamepad2',
      description: 'Pilih game dan paket'
    },
    {
      id: 2,
      title: 'Checkout',
      icon: 'ShoppingCart',
      description: 'Konfirmasi pesanan'
    },
    {
      id: 3,
      title: 'Pembayaran',
      icon: 'CreditCard',
      description: 'Proses pembayaran'
    },
    {
      id: 4,
      title: 'Selesai',
      icon: 'CheckCircle',
      description: 'Transaksi berhasil'
    }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="gaming-card p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Navigation" size={24} className="text-primary" />
        <h2 className="text-xl font-gaming font-bold text-foreground">Progress Checkout</h2>
      </div>
      {/* Mobile Progress Bar */}
      <div className="block md:hidden mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Langkah {currentStep} dari {totalSteps}
          </span>
          <span className="text-sm text-text-secondary">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-surface rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="mt-3 text-center">
          <h3 className="font-semibold text-foreground">{steps?.[currentStep - 1]?.title}</h3>
          <p className="text-sm text-text-secondary">{steps?.[currentStep - 1]?.description}</p>
        </div>
      </div>
      {/* Desktop Step Indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => {
            const status = getStepStatus(step?.id);
            const isLast = index === steps?.length - 1;

            return (
              <div key={step?.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      status === 'completed'
                        ? 'bg-success border-success text-white'
                        : status === 'current' ?'bg-primary border-primary text-black shadow-neon-blue' :'bg-surface border-border text-text-secondary'
                    }`}
                  >
                    {status === 'completed' ? (
                      <Icon name="Check" size={20} />
                    ) : (
                      <Icon name={step?.icon} size={20} />
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="mt-3 text-center">
                    <h4
                      className={`text-sm font-semibold ${
                        status === 'current' ?'text-primary'
                          : status === 'completed' ?'text-success' :'text-text-secondary'
                      }`}
                    >
                      {step?.title}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">{step?.description}</p>
                  </div>
                </div>
                {/* Connector Line */}
                {!isLast && (
                  <div className="flex-1 mx-4 mt-[-2rem]">
                    <div
                      className={`h-0.5 transition-all duration-500 ${
                        status === 'completed'
                          ? 'bg-success'
                          : status === 'current' ?'bg-gradient-to-r from-primary to-border' :'bg-border'
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Estimated Time */}
      <div className="mt-6 p-4 bg-surface/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Estimasi Waktu Tersisa</span>
          </div>
          <span className="text-sm font-bold text-primary">2-3 menit</span>
        </div>
        <div className="mt-2 text-xs text-text-secondary">
          Proses checkout biasanya selesai dalam waktu singkat
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
import React, { useState } from 'react';
import { Studio } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { toast } from 'sonner';
import { X, Calendar, Clock, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface BookingModalProps {
  studio: Studio;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onRequireAuth?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  studio,
  isOpen,
  onClose,
  onSuccess,
  onRequireAuth,
}) => {
  const { user } = useAuth();

  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  if (!isOpen) return null;

  
  const calculateDuration = () => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;
    if (endMins <= startMins) return 0;
    return Math.max(1, (endMins - startMins) / 60);
  };

  const hours = calculateDuration();
  const subtotal = hours * studio.hourlyRate;
  const serviceFee = Math.round(subtotal * 0.10);
  const securityDeposit = studio.securityDeposit || 0;
  const totalCost = subtotal + serviceFee + securityDeposit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    if (!user) {
      toast.error('Please sign in to reserve this workspace');
      onRequireAuth?.();
      return;
    }

    if (hours <= 0) {
      toast.error('End time must be later than start time');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studioId: studio.id,
          date,
          startTime,
          endTime,
          hours,
          specialRequests,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          // Double-booking conflict
          setConflictError(data.error);
          toast.error(data.error, { duration: 6000 });
        } else {
          toast.error(data.error || 'Failed to place reservation');
        }
        setLoading(false);
        return;
      }

      toast.success('Workspace reserved! Status: Pending host review.');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Network error occurred during reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reserve Workspace</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{studio.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        {conflictError && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500 dark:text-red-400" />
            <div>
              <p className="font-semibold">Schedule Conflict Detected</p>
              <p className="mt-0.5 text-[11px] leading-relaxed">{conflictError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Production Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setConflictError(null);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Time pickers: Start & End */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Start Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setConflictError(null);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                End Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setConflictError(null);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {hours <= 0 && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              * Please specify an end time that occurs after start time.
            </p>
          )}

          {/* Special Requests */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Production Notes & Gear Requests (Optional)
            </label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Loading dock access needed at 9:30 AM, request 9ft seamless white paper roll."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Transparent Cost Breakdown */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Rate (${studio.hourlyRate}/hr × {hours} hrs)</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200 font-semibold">${subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Platform Service & Insurance Fee (10%)</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200 font-semibold">${serviceFee}</span>
            </div>
            {securityDeposit > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  Refundable Damage Deposit
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                </span>
                <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200 font-semibold">${securityDeposit}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
              <span>Total Estimated Due</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">${totalCost}</span>
            </div>
          </div>

          {/* Host Guarantee notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>Backed by $1M Host Guarantee & verified studio equipment check.</span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading || hours <= 0}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Request Booking (${totalCost})
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

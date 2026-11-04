import React, { useState, useEffect } from 'react';
import { Booking } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Ban, 
  FileText, 
  Printer, 
  X, 
  Download,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface MyBookingsPageProps {
  navigate: (path: string) => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ navigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/my-bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto my-32 p-8 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 dark:text-slate-400">Loading your production schedule...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-center space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign In Required</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Please sign in to view your studio reservations and call sheets.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleCancelBooking = async (id: string) => {
    setCancellingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to cancel reservation');
        setCancellingId(null);
        return;
      }

      toast.success('Reservation cancelled');
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' } : b))
      );
    } catch (err) {
      toast.error('Network error during cancellation');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            Pending Host Approval
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
            Production Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            My Workspace Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review call-sheet dates, verify studio access times, download invoices, or cancel pending bookings.
          </p>
        </div>

        <button
          onClick={() => navigate('/studios')}
          className="self-start sm:self-auto px-4 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Building2 className="w-4 h-4" />
          <span>Book Another Space</span>
        </button>
      </div>

      
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div
              key={booking.id}
              className="p-5 sm:p-6 rounded-2xl border transition-all bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              
              
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={booking.studioImage}
                  alt={booking.studioTitle}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 bg-slate-900 border border-slate-200 dark:border-slate-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/hero_sound_stage_1793389976920.jpg';
                  }}
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {getStatusBadge(booking.status)}
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {booking.id}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                    {booking.studioTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{booking.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{booking.studioLocation}</span>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 truncate">
                      Special Request: "{booking.specialRequests}"
                    </p>
                  )}
                </div>
              </div>

              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between lg:justify-end gap-3 sm:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-700/60">
                <div className="text-left sm:text-left lg:text-right">
                  <div className="flex items-baseline gap-1 lg:justify-end">
                    <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                      ${booking.totalCost}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">total</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    ${booking.hourlyRate}/hr · {booking.hours}h session
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  

                  <button
                    onClick={() => setInvoiceBooking(booking)}
                    title="Download Official Booking Invoice / Receipt"
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>

                  <button
                    onClick={() => navigate(`/studios/${booking.studioId}`)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    View Studio
                  </button>

                  {booking.status === 'Pending' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>{cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        


        <div className="p-12 text-center rounded-3xl border bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 max-w-lg mx-auto my-8 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            No Workspace Reservations Yet
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Ready for your next production? Search our directory of photo studios, recording live rooms, and podcast suites.
          </p>
          <button
            onClick={() => navigate('/studios')}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            Explore Available Studios
          </button>
        </div>
      )}

      


      {invoiceBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            
            


            <div className="p-4 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between print:hidden">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Booking Invoice & Call Sheet Receipt
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setInvoiceBooking(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            
            <div className="p-8 sm:p-10 overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 print:p-0 print:m-0">
              
              
              <div className="flex items-start justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
                      <line x1="9.69" y1="8" x2="21.17" y2="8" />
                      <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
                      <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
                      <line x1="14.31" y1="16" x2="2.83" y2="16" />
                      <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">StudioSpace</h2>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Creative Workspace Platform</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                    INV-2026-{invoiceBooking.id.toUpperCase().slice(-6)}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Date: {new Date(invoiceBooking.createdAt).toLocaleDateString()}
                  </span>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {invoiceBooking.status === 'Confirmed' ? 'PAID & CONFIRMED' : 'RESERVATION IN ESCROW'}
                  </span>
                </div>
              </div>

              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Billed To (Creator)
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">{invoiceBooking.userName}</p>
                  <p className="text-slate-600 dark:text-slate-400 font-mono mt-0.5">{invoiceBooking.userEmail}</p>
                  <p className="text-slate-500 text-[11px] mt-1">Verified StudioSpace Member</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Reserved Studio
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">{invoiceBooking.studioTitle}</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">{invoiceBooking.studioLocation}</p>
                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                    {invoiceBooking.date} · {invoiceBooking.startTime} to {invoiceBooking.endTime}
                  </p>
                </div>
              </div>

              
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Production Rate Breakdown
                </span>
                
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[340px] text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-left">
                        <th className="py-2 font-medium">Description</th>
                        <th className="py-2 font-medium text-center">Hours</th>
                        <th className="py-2 font-medium text-right">Rate</th>
                        <th className="py-2 font-medium text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="py-3 font-medium">Studio Time Access ({invoiceBooking.studioTitle})</td>
                        <td className="py-3 text-center font-mono">{invoiceBooking.hours} hrs</td>
                        <td className="py-3 text-right font-mono">${invoiceBooking.hourlyRate}/hr</td>
                        <td className="py-3 text-right font-bold font-mono">${invoiceBooking.subtotal}.00</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-slate-600 dark:text-slate-400">Creator Protection & 24/7 Dispatch Fee (10%)</td>
                        <td className="py-2.5 text-center font-mono">—</td>
                        <td className="py-2.5 text-right font-mono">10%</td>
                        <td className="py-2.5 text-right font-mono">${invoiceBooking.serviceFee}.00</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-slate-600 dark:text-slate-400">
                          Refundable Damage & Security Deposit
                          <span className="block text-[10px] text-slate-400">(Held in escrow, released within 24h post-shoot)</span>
                        </td>
                        <td className="py-2.5 text-center font-mono">—</td>
                        <td className="py-2.5 text-right font-mono">—</td>
                        <td className="py-2.5 text-right font-mono">${invoiceBooking.securityDeposit}.00</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-900 dark:border-slate-100 font-bold text-sm">
                        <td colSpan={3} className="py-3 text-right">Total Amount:</td>
                        <td className="py-3 text-right font-mono text-indigo-600 dark:text-indigo-400">
                          ${invoiceBooking.totalCost}.00
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>




              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <p className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Protected by StudioSpace $1,000,000 Host & Equipment Guarantee
                </p>
                <p>
                  Please present this call sheet invoice to the studio host upon arrival. Entry door codes and WiFi credentials are sent 1 hour prior to session call time.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

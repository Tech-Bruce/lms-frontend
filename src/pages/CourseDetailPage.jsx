import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  FiClock,
  FiCheckCircle,
  FiBookOpen,
  FiAward,
  FiPlayCircle,
  FiArrowLeft,
  FiShield,
  FiMessageCircle,
  FiUsers,
  FiX,
} from 'react-icons/fi';

const CourseDetailPage = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state?.lms_auth.user);
  const uploadurl = import.meta.env.VITE_API_UPLOAD_URL;

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', phone: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEnrollClick = async () => {
    if (!user) {
      toast.error('Please log in to enroll in this course.');
      return;
    }
    
    try {
      setIsProcessing(true);
      const userProfile = await api.get(`/users/${user.id}`);
      setCheckoutForm({
        name: userProfile.data?.name || user.name || '',
        email: userProfile.data?.email || user.email || '',
        phone: userProfile.data?.phone || '',
      });
      setShowCheckoutModal(true);
    } catch (err) {
      console.error(err);
      setCheckoutForm({ name: user.name || '', email: user.email || '', phone: '' });
      setShowCheckoutModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const initiatePayment = async (e) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.email) {
      toast.error('Name and Email are required.');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Dynamically load Razorpay script
      const loadScript = (src) => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };
      
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }
      // 1. Create Order
      const orderRes = await api.post('/students/payment/create-order', {
        courseId: course._id,
      });

      if (!orderRes.data?.success) {
        toast.error('Failed to initiate payment.');
        setIsProcessing(false);
        return;
      }

      setShowCheckoutModal(false);

      // 2. Open Razorpay Checkout
      const options = {
        key: 'rzp_test_TZv4lKDdFb5xTk', 
        amount: orderRes.data.order.amount,
        currency: orderRes.data.order.currency,
        name: 'TheCyberBrigade LMS',
        description: `Enrollment for ${course.title}`,
        order_id: orderRes.data.order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await api.post(
              `/students/payment/verify/${user.id}`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course._id,
              }
            );

            if (verifyRes.data?.success) {
              toast.success('Successfully enrolled in the course!');
            } else {
              toast.error(verifyRes.data?.message || 'Payment verification failed.');
            }
          } catch (error) {
            toast.error(
              error.response?.data?.message || 'Error verifying payment.'
            );
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: checkoutForm.name,
          email: checkoutForm.email,
          contact: checkoutForm.phone,
        },
        theme: {
          color: '#2563EB',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(response.error.description);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Unable to load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  /* -----------------------------------------
     Loading State
  ----------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#05060F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-400">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  /* -----------------------------------------
     Course Not Found
  ----------------------------------------- */
  if (!course) {
    return (
      <div className="min-h-screen bg-[#05060F] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-6">
            <FiBookOpen className="text-gray-400 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Course Not Found
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            The course you are looking for may have been removed or is currently unavailable in the directory.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            <FiArrowLeft />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060F] text-gray-200 pb-20 font-sans">
      
      {/* =========================================
          HERO SECTION (Dark professional header)
      ========================================== */}
      <section className="bg-[#0A0E17] border-b border-white/5 pt-36 pb-16 lg:pb-24 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-8 font-medium">
            <Link to="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <span>/</span>
            <span className="text-gray-300 truncate max-w-xs">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
            
            {/* Header Content */}
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {course.level && (
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wide border border-blue-500/20">
                    {course.level}
                  </span>
                )}
                {course.duration && (
                  <span className="inline-flex items-center gap-2 text-sm text-gray-400 font-medium">
                    <FiClock className="text-gray-500" />
                    {course.duration}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.2] tracking-tight mb-6">
                {course.title}
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-8 mt-10">
                <div className="flex items-center gap-3">
                  <FiBookOpen className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Delivery</p>
                    <p className="text-sm font-semibold text-gray-200">Online Structured</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiAward className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Outcome</p>
                    <p className="text-sm font-semibold text-gray-200">Applied Knowledge</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiShield className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Access</p>
                    <p className="text-sm font-semibold text-gray-200">Enterprise Grade</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Placeholder for Sidebar (Leaves empty space in header for absolute positioning of card below) */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* =========================================
          MAIN CONTENT
      ========================================== */}
      <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
          
          {/* =====================================
              LEFT COLUMN (Overview & Syllabus)
          ====================================== */}
          <div className="py-12 lg:py-16 space-y-16">
            
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">
                Course Overview
              </h2>
              <div className="prose prose-invert max-w-none text-gray-400">
                <p className="leading-relaxed text-base">
                  {course.description}
                </p>
              </div>
            </section>

            {/* Curriculum */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-2">
                Curriculum
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                Structured learning modules designed for comprehensive mastery.
              </p>

              <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0E17]">
                {course.syllabus?.length > 0 ? (
                  course.syllabus.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-6 ${
                        index !== course.syllabus.length - 1
                          ? 'border-b border-white/5'
                          : ''
                      } hover:bg-white/[0.02] transition-colors`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 text-gray-300 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-base font-medium text-gray-200 leading-snug">
                          {item}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs font-medium text-gray-500">
                          <FiPlayCircle className="text-gray-400" />
                          <span>Video Lesson</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-gray-500">
                    Curriculum details are currently being updated.
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* =====================================
              RIGHT SIDEBAR (Sticky Enrollment Card)
          ====================================== */}
          <aside className="relative lg:-mt-64 z-20">
            <div className="lg:sticky lg:top-28 space-y-6">
              
              {/* Enrollment Card */}
              <div className="bg-[#111520] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[#05060F]">
                  <img
                    src={`${uploadurl}/course/${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FiPlayCircle className="text-white text-3xl" />
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <span className="text-3xl font-bold text-white">
                        ${course.price}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleEnrollClick}
                    disabled={isProcessing}
                    className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition-colors flex items-center justify-center mb-4"
                  >
                    {isProcessing ? 'Processing...' : 'Enroll Now'}
                  </button>
                  <p className="text-center text-xs text-gray-500 font-medium">
                    Full lifetime access upon enrollment
                  </p>

                  {/* Includes List */}
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wide">
                      This course includes:
                    </h3>
                    <div className="space-y-4">
                      {course.features?.length > 0 ? (
                        course.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <FiCheckCircle className="flex-shrink-0 mt-0.5 text-gray-400" />
                            <span className="text-sm text-gray-300 leading-relaxed">
                              {feature}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Standard features included.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enterprise Support Card */}
              <div className="bg-[#111520] border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <FiUsers className="text-gray-400 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Training for Teams?</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                      Get this course plus comprehensive management tools for your enterprise.
                    </p>
                    <Link to="/contact" className="text-sm text-blue-400 font-medium hover:text-blue-300">
                      Contact Sales &rarr;
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111520] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2"
            >
              <FiX className="text-xl" />
            </button>
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Checkout Details</h2>
              <p className="text-gray-400 text-sm mb-6">Please confirm your details before proceeding to payment.</p>
              
              <form onSubmit={initiatePayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                    className="w-full bg-[#05060F] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                    className="w-full bg-[#05060F] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Phone Number (Optional)</label>
                  <input 
                    type="tel"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                    className="w-full bg-[#05060F] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition-colors flex items-center justify-center shadow-lg"
                >
                  {isProcessing ? 'Processing...' : `Proceed to Pay $${course.price}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;

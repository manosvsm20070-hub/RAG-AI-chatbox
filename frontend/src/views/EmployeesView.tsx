import React, { useState } from 'react';
import { Star, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { feedbackMock } from '../api/mockData';
import { EmployeeFeedback } from '../types';

export const EmployeesView: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<EmployeeFeedback[]>(feedbackMock);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('AI Assistant');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newFb: EmployeeFeedback = {
      id: `fb-${Date.now()}`,
      employeeName: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Product & AI Platform',
      category,
      comment,
      rating,
      date: 'Just now',
      status: 'new'
    };

    setFeedbackList([newFb, ...feedbackList]);
    setComment('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="font-heading font-bold text-2xl text-on-surface">
          Employee Profiles & Workplace Feedback
        </h1>
        <p className="text-xs text-on-surface-variant">
          Voice of the organization: employee reviews, tool feedback, and workspace sentiment
        </p>
      </div>

      {/* Submit Feedback Form Card */}
      <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-4">
        <h2 className="font-heading font-bold text-sm text-on-surface flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span>Submit Workplace Feedback</span>
        </h2>

        {isSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you! Your feedback has been recorded and dispatched to People Ops.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface-container-low border border-surface-container px-3 py-2 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
              >
                <option>AI Assistant & Search</option>
                <option>Leave & Policy</option>
                <option>Office & Facilities</option>
                <option>Tooling & Remote Work</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Rating
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-outline-variant'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Your Comment / Suggestion
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with Nexus AI, workplace policies, or team operations..."
              className="w-full bg-surface-container-low border border-surface-container p-3 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Feedback</span>
          </button>
        </form>
      </div>

      {/* Recent Feedback Feed */}
      <div className="space-y-3">
        <h2 className="font-heading font-bold text-sm text-on-surface">
          Recent Employee Feedback Submissions
        </h2>

        <div className="space-y-3">
          {feedbackList.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 shadow-subtle space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.avatar}
                    alt={item.employeeName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/20"
                  />
                  <div>
                    <h3 className="font-semibold text-xs text-on-surface">
                      {item.employeeName}
                    </h3>
                    <p className="text-[10px] text-on-surface-variant">
                      {item.department} • {item.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed pl-1">
                "{item.comment}"
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-surface-container text-[10px] text-outline">
                <span>Submitted {item.date}</span>
                <span className="font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full capitalize">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

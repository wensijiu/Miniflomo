import { X, Search, MessageCircle, Book, Lightbulb, ChevronRight, Send } from 'lucide-react';
import { useState } from 'react';

interface HelpPageProps {
  onClose: () => void;
}

const FAQ_CATEGORIES = [
  {
    title: '快速开始',
    icon: '🚀',
    items: [
      {
        q: '如何快速记录一条笔记？',
        a: '点击底部导航栏的"记录"按钮，在输入框中输入内容，点击"添加标签"选择或创建标签，最后点击"保存"按钮即可。',
      },
      {
        q: '标签有什么作用？',
        a: '标签帮助你组织和分类笔记。你可以通过点击标签快速筛选相关笔记，也可以在"标签"页面管理所有标签。',
      },
      {
        q: '如何创建新标签？',
        a: '在添加笔记时，点击"添加标签"，在标签选择界面的输入框中输入新标签名称，然后按回车键或点击"创建"按钮。',
      },
    ],
  },
  {
    title: '笔记管理',
    icon: '📝',
    items: [
      {
        q: '如何编辑已有的笔记？',
        a: '在笔记列表中点击要编辑的笔记卡片，会进入全屏编辑模式。修改内容和标签后，点击右上角的"✓"保存修改。',
      },
      {
        q: '如何删除笔记？',
        a: '在笔记列表中，向左滑动笔记卡片，会出现红色的删除按钮。点击删除按钮即可删除该笔记。',
      },
      {
        q: '如何搜索笔记？',
        a: '在"浏览"页面顶部，点击搜索图标，在搜索框中输入关键词，系统会实时搜索匹配的笔记内容。',
      },
      {
        q: '如何按标签筛选笔记？',
        a: '在"浏览"页面，点击标签筛选栏中的任意标签，即可只显示包含该标签的笔记。再次点击可取消筛选。',
      },
    ],
  },
  {
    title: '标签管理',
    icon: '🏷️',
    items: [
      {
        q: '如何重命名标签？',
        a: '在"标签"页面，找到要重命名的标签，点击右侧的"重命名"按钮，输入新名称后确认即可。所有使用该标签的笔记都会自动更新。',
      },
      {
        q: '如何删除标签？',
        a: '在"标签"页面，点击标签右侧的"删除"按钮。删除标签后，该标签会从所有笔记中移除。',
      },
      {
        q: '为什么没有子标签功能？',
        a: 'ria 采用扁平化的标签结构，避免层级过深带来的复杂性。简单的标签系统更利于快速记录和查找。',
      },
    ],
  },
  {
    title: '随机回顾',
    icon: '🔀',
    items: [
      {
        q: '随机回顾有什么用？',
        a: '随机回顾会从你的所有笔记中随机��取一条展示，帮助你重新发现过往的思考，创造思维碰撞的机会。',
      },
      {
        q: '如何使用随机回顾？',
        a: '在"我的"页面点击"随机回顾"卡片，或在个人中心点击相应入口。点击"再来一条"可以继续随机查看其他笔记。',
      },
      {
        q: '随机回顾会重复吗？',
        a: '会的。随机回顾是完全随机的，同一条笔记可能会多次出现，这也增加了与过往思考再次相遇的偶然性。',
      },
    ],
  },
  {
    title: '数据统计',
    icon: '📊',
    items: [
      {
        q: '如何查看我的记录统计？',
        a: '在"我的"页面可以看到核心数据卡片。点击"数据统计"可以查看更详细的图表和分析。',
      },
      {
        q: '如何设置目标？',
        a: '在"我的"页面点击"目标设置"，可以设置周目标和月目标。系统会根据你的实际记录情况计算达成率。',
      },
      {
        q: '连续记录天数如何计算？',
        a: '从今天往前推算，只要每天至少有一条笔记，就算连续记录。中断一天后，连续天数会重新从 0 开始计算。',
      },
    ],
  },
  {
    title: '提醒功能',
    icon: '🔔',
    items: [
      {
        q: '如何设置回顾提醒？',
        a: '在"我的"页面点击"回顾提醒"，开启提醒开关并选择提醒时间和频率。在微信小程序中需要授权订阅消息。',
      },
      {
        q: '提醒消息什么时候推送？',
        a: '根据你设置的时间和频率，系统会在指定时间向你推送提醒消息。点击消息可直接打开小程序查看回顾。',
      },
      {
        q: '可以自定义提醒频率吗？',
        a: '可以。提醒频率支持每天、每周和自定义模式。自定义模式下，你可以选择一周中的任意几天接收提醒。',
      },
    ],
  },
  {
    title: '数据安全',
    icon: '🔒',
    items: [
      {
        q: '我的笔记数据存储在哪里？',
        a: '目前所有数据都存储在本地浏览器的 localStorage 中。未来微信小程序版本会支持云端同步。',
      },
      {
        q: '数据会丢失吗？',
        a: '只要不清除浏览器数据，你的笔记就会一直保存。建议定期导出备份（未来功能）。',
      },
      {
        q: '如何导出我的数据？',
        a: '数据导出功能正在开发中，未来版本将支持导出为 JSON、Markdown 等格式。',
      },
    ],
  },
];

export function HelpPage({ onClose }: HelpPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const toggleItem = (categoryTitle: string, questionIndex: number) => {
    const key = `${categoryTitle}-${questionIndex}`;
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      alert('请输入反馈内容');
      return;
    }
    
    // 在真实环境中，这里会提交到后端
    alert('感谢你的反馈！我们会认真阅读并持续改进。');
    setFeedbackText('');
    setShowFeedbackForm(false);
  };

  // Filter FAQ items based on search
  const filteredCategories = searchQuery
    ? FAQ_CATEGORIES.map(category => ({
        ...category,
        items: category.items.filter(
          item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(category => category.items.length > 0)
    : FAQ_CATEGORIES;

  return (
    <div className="fixed inset-0 bg-background z-50">
      <div className="h-screen flex flex-col max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-border bg-white relative">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-base absolute left-1/2 -translate-x-1/2">帮助与反馈</h1>
          <div className="w-8" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search Bar */}
          <div className="sticky top-0 bg-white z-10 p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索常见问题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-accent/30 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="p-4">
            {/* Quick Actions */}
            {!searchQuery && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <QuickActionCard
                  icon={<Book className="w-6 h-6" />}
                  title="使用指南"
                  desc="了解核心功能"
                  onClick={() => setActiveCategory('快速开始')}
                />
                <QuickActionCard
                  icon={<MessageCircle className="w-6 h-6" />}
                  title="问题反馈"
                  desc="告诉我们你的想法"
                  onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                />
              </div>
            )}

            {/* Feedback Form */}
            {showFeedbackForm && (
              <div className="bg-white rounded-2xl p-5 mb-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-medium">提交反馈</h3>
                </div>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="请描述你遇到的问题或建议..."
                  className="w-full h-32 p-3 bg-accent/30 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFeedbackForm(false)}
                    className="flex-1 h-10 rounded-full bg-accent/50 text-sm transition-all active:scale-95"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    className="flex-1 h-10 rounded-full bg-primary text-primary-foreground text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>提交</span>
                  </button>
                </div>
              </div>
            )}

            {/* FAQ Categories */}
            <div className="space-y-3">
              {filteredCategories.map((category) => (
                <div key={category.title} className="bg-white rounded-2xl border border-border overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className="text-base font-medium">{category.title}</h3>
                      <span className="ml-auto text-xs text-muted-foreground bg-accent/50 px-2 py-1 rounded-full">
                        {category.items.length}
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {category.items.map((item, index) => {
                      const key = `${category.title}-${index}`;
                      const isExpanded = expandedItems.has(key);
                      return (
                        <button
                          key={index}
                          onClick={() => toggleItem(category.title, index)}
                          className="w-full text-left transition-colors hover:bg-accent/30"
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium mb-1">{item.q}</h4>
                                {isExpanded && (
                                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                                    {item.a}
                                  </p>
                                )}
                              </div>
                              <ChevronRight
                                className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                                  isExpanded ? 'rotate-90' : ''
                                }`}
                              />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {searchQuery && filteredCategories.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center border border-border">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-base font-medium mb-2">没有找到相关问题</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  试试其他关键词，或直接向我们反馈
                </p>
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="h-10 px-6 bg-primary text-primary-foreground rounded-full text-sm transition-all active:scale-95"
                >
                  提交问题
                </button>
              </div>
            )}

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 mt-4 border border-primary/20">
              <h3 className="text-base font-medium mb-2">💬 还有其他问题？</h3>
              <p className="text-sm text-muted-foreground mb-3">
                我们随时准备为你提供帮助
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="flex-1 h-10 bg-white rounded-full text-sm font-medium transition-all active:scale-95"
                >
                  问题反馈
                </button>
                <button
                  onClick={() => alert('邮箱：feedback@weimo.app')}
                  className="flex-1 h-10 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-all active:scale-95"
                >
                  联系我们
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-muted/30 rounded-2xl p-4 mt-4 mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <span>💡</span>
                <span>使用小贴士</span>
              </h4>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>• 使用搜索功能可以快速找到相关问题</p>
                <p>• 点击问题可展开查看详细答案</p>
                <p>• 遇到问题可以直接提交反馈</p>
                <p>• 我们会持续更新常见问题库</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ 
  icon, 
  title, 
  desc, 
  onClick 
}: { 
  icon: React.ReactNode; 
  title: string; 
  desc: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-4 border border-border text-left hover:border-primary/30 transition-all active:scale-98"
    >
      <div className="text-primary mb-3">{icon}</div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </button>
  );
}
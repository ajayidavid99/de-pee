// src/app/(protected)/@admin/inbox/page.tsx
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  deleteInboundEmail,
  getInboundEmailById,
  getInboundEmails,
  sendInboxReply,
  toggleEmailReadStatus,
  type InboundEmail,
} from '@/features/inbox/server/actions';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Circle,
  Inbox as InboxIcon,
  Mail,
  MailOpen,
  RefreshCw,
  Reply,
  Search,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function AdminInboxPage() {
  const [emails, setEmails] = useState<Omit<InboundEmail, 'html_body'>[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<InboundEmail | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [search, setSearch] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Reply Dialog state
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const fetchList = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await getInboundEmails({ filter, search });
      setEmails(res.data);
      setUnreadCount(res.unreadCount);
      // On desktop, auto-select first. On mobile, we shouldn't auto-select so the user sees the list first.
      if (res.data.length > 0 && !selectedId && window.innerWidth >= 768) {
        const firstEmail = res.data[0];
        if (firstEmail) {
          setSelectedId(firstEmail.id);
        }
      }
    } catch {
      toast.error('Failed to load inbox messages.');
    } finally {
      setLoadingList(false);
    }
  }, [filter, search, selectedId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    if (!selectedId) {
      setSelectedEmail(null);
      return;
    }
    let isMounted = true;
    setLoadingDetail(true);
    getInboundEmailById(selectedId)
      .then((data) => {
        if (isMounted) {
          setSelectedEmail(data);
          setEmails((prev) =>
            prev.map((item) =>
              item.id === selectedId ? { ...item, read_at: item.read_at || new Date().toISOString() } : item,
            ),
          );
        }
      })
      .catch(() => toast.error('Failed to load email message.'))
      .finally(() => {
        if (isMounted) setLoadingDetail(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedId]);

  const handleToggleRead = (e: React.MouseEvent, id: string, currentRead: boolean) => {
    e.stopPropagation();
    startTransition(async () => {
      await toggleEmailReadStatus(id, !currentRead);
      fetchList();
      if (selectedEmail?.id === id) {
        setSelectedEmail((prev) =>
          prev ? { ...prev, read_at: currentRead ? null : new Date().toISOString() } : null,
        );
      }
      toast.success(currentRead ? 'Marked as unread' : 'Marked as read');
    });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this email?')) return;
    startTransition(async () => {
      await deleteInboundEmail(id);
      if (selectedId === id) {
        setSelectedId(null);
        setSelectedEmail(null);
      }
      fetchList();
      toast.success('Email deleted');
    });
  };

  const handleSendReply = async () => {
    if (!selectedEmail || !replyBody.trim()) return;
    setIsReplying(true);

    // Construct the official HTML signature
    const signatureHtml = `
      <br/><br/>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 16px 0;" />
      <div style="font-family: sans-serif; font-size: 12px; color: #555; line-height: 1.5;">
        <strong>De-Pee Ventures Support</strong><br/>
        Ilesa Road, directly opposite the Obafemi Awolowo University Teaching Hospitals Complex (OAUTHC) Phase 1<br/>
        Ile-Ife, Osun State<br/>
        Phone: +234 806 784 4732
      </div>
    `;

    try {
      await sendInboxReply(
        selectedEmail.from_email,
        `Update regarding your message to De-Pee Ventures`,
        `<p style="font-family: sans-serif; font-size: 14px; color: #333;">${replyBody.replace(/\n/g, '<br/>')}</p>${signatureHtml}`,
      );
      toast.success('Reply sent successfully!');
      setReplyOpen(false);
      setReplyBody('');
    } catch {
      toast.error('Failed to send reply.');
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="flex h-[calc(100svh-5rem)] min-h-[700px] flex-col gap-3 -mt-3 md:-mt-1">
      {/* Top Header Controls */}
      <div className={`flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${selectedId ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
          {unreadCount > 0 && (
            <Badge variant="default" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchList()}
            disabled={loadingList || isPending}
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${loadingList ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Container */}
      <Card className="grid flex-1 min-h-0 overflow-hidden md:grid-cols-12">
        
        {/* Left Column: Email List - Hidden on mobile if an email is selected */}
        <div className={`flex-col border-r border-border md:col-span-5 lg:col-span-4 ${selectedId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sender or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as 'all' | 'unread')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="all" className="text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">
                  Unread ({unreadCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {loadingList ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))
            ) : emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <InboxIcon className="h-10 w-10 mb-2 stroke-1" />
                <p className="text-sm font-medium">No messages found</p>
              </div>
            ) : (
              emails.map((email) => {
                const isSelected = selectedId === email.id;
                const isUnread = !email.read_at;

                return (
                  <div
                    key={email.id}
                    onClick={() => setSelectedId(email.id)}
                    className={`group relative flex cursor-pointer flex-col gap-1 p-3.5 transition-colors hover:bg-muted/50 ${
                      isSelected ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        {isUnread ? (
                          <Circle className="h-2 w-2 fill-primary text-primary shrink-0" />
                        ) : (
                          <div className="h-2 w-2 shrink-0" />
                        )}
                        <span
                          className={`truncate text-xs ${
                            isUnread ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'
                          }`}
                        >
                          {email.from_name || email.from_email}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(email.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <p
                      className={`truncate text-xs ${
                        isUnread ? 'font-semibold text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {email.subject || '(No Subject)'}
                    </p>

                    <p className="line-clamp-1 text-[11px] text-muted-foreground/80">
                      {email.text_body || 'No text content available'}
                    </p>

                    <div className="absolute right-2 bottom-2 hidden group-hover:flex items-center gap-1 bg-background/90 rounded-md p-0.5 border shadow-xs">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleToggleRead(e, email.id, !isUnread)}
                      >
                        {isUnread ? <MailOpen className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={(e) => handleDelete(e, email.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Email Content View - Hidden on mobile if NO email is selected */}
        <div className={`flex-col min-h-0 md:col-span-7 lg:col-span-8 bg-background ${!selectedId ? 'hidden md:flex' : 'flex'}`}>
          {loadingDetail ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
              <Skeleton className="h-64 w-full" />
            </div>
          ) : selectedEmail ? (
            <div className="flex h-full flex-col min-h-0">
              {/* Header Actions Bar */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden shrink-0"
                    onClick={() => setSelectedId(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setReplyOpen(true)}
                  >
                    <Reply className="h-4 w-4" />
                    <span className="hidden sm:inline">Reply</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) =>
                      handleToggleRead(e, selectedEmail.id, !!selectedEmail.read_at)
                    }
                  >
                    {selectedEmail.read_at ? (
                      <>
                        <Mail className="h-4 w-4 sm:mr-1.5" /> 
                        <span className="hidden sm:inline">Mark Unread</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 sm:mr-1.5" /> 
                        <span className="hidden sm:inline">Mark Read</span>
                      </>
                    )}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={(e) => handleDelete(e, selectedEmail.id)}
                >
                  <Trash2 className="h-4 w-4 sm:mr-1.5" /> 
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>

              {/* Message Details */}
              <div className="p-4 border-b border-border space-y-3">
                <h2 className="text-xl font-semibold">{selectedEmail.subject || '(No Subject)'}</h2>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {(selectedEmail.from_name || selectedEmail.from_email).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {selectedEmail.from_name || selectedEmail.from_email}
                        </span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          &lt;{selectedEmail.from_email}&gt;
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        To: {selectedEmail.to_email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{new Date(selectedEmail.created_at).toLocaleString()}</span>
                    <span className="sm:hidden">{new Date(selectedEmail.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Email Content Body */}
              <div className="flex-1 min-h-0 p-4 md:p-6 overflow-hidden">
                {selectedEmail.html_body ? (
                  <iframe
                    title="Email Body"
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <style>
                            *, *::before, *::after {
                              box-sizing: border-box;
                            }
                            html, body {
                              height: 100%;
                            }
                            body {
                              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                              line-height: 1.5;
                              color: #333;
                              margin: 0;
                              padding: 16px;
                              word-wrap: break-word;
                              overflow-wrap: break-word;
                            }
                            /* Responsive image & media scaling */
                            img, video, svg, canvas {
                              max-width: 100% !important;
                              height: auto !important;
                              object-fit: contain;
                            }
                            /* Ensure wide tables scroll horizontally rather than stretching the view */
                            table {
                              max-width: 100% !important;
                            }
                          </style>
                        </head>
                        <body>${selectedEmail.html_body}</body>
                      </html>
                    `}
                    className="block w-full h-full min-h-[500px] border-0 rounded-md bg-white"
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
                    {selectedEmail.text_body || 'No content provided.'}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Mail className="h-12 w-12 mb-3 stroke-1" />
              <p className="text-base font-medium">Select a message to view</p>
            </div>
          )}
        </div>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to {selectedEmail?.from_name || selectedEmail?.from_email}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Original Message Preview */}
            <div className="text-sm text-muted-foreground border-l-2 pl-3 line-clamp-2">
              {selectedEmail?.text_body}
            </div>
            
            {/* Reply Input & Signature Preview */}
            <div className="space-y-3">
              <Textarea
                placeholder="Type your reply here..."
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                className="min-h-[150px] resize-none"
              />
              
              <div className="rounded-md bg-muted/50 p-3 text-[11px] leading-relaxed text-muted-foreground border border-border/50">
                <p className="font-semibold text-foreground mb-1">Signature appended automatically:</p>
                <p>De-Pee Ventures Support</p>
                <p>Ilesa Road, directly opposite the Obafemi Awolowo University Teaching Hospitals Complex (OAUTHC) Phase 1<br/>Ile-Ife, Osun State</p>
                <p>Phone: +234 806 784 4732</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyOpen(false)} disabled={isReplying}>
              Cancel
            </Button>
            <Button onClick={handleSendReply} disabled={isReplying || !replyBody.trim()}>
              {isReplying ? 'Sending...' : 'Send Reply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
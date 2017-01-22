using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsApplication2
{


    public partial class Form1 : Form
    {

        List<Node> nodes = new List<Node>();
        [DllImport("User32.dll")]
        public static extern IntPtr GetDC(IntPtr hwnd);
        [DllImport("User32.dll")]
        public static extern void ReleaseDC(IntPtr hwnd, IntPtr dc);
        public Form1()
        {
            InitializeComponent();
            for (int i = 0; i < 10; i++)
            {
                nodes.Add(new Node());
            }
        }

        int rx = Cursor.Position.X;
        int ry = Cursor.Position.Y;

        int fx = Cursor.Position.X;
        int fy = Cursor.Position.Y;

        float tx = 100;
        float ty = 100;

        float vx = 0;
        float vy = 0;

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void Form1_MouseMove(object sender, MouseEventArgs e)
        {

        }

        private void timer1_Tick(object sender, EventArgs e)
        {

            var cvx = Cursor.Position.X - fx;
            var cvy = Cursor.Position.Y - fy;
            //++++++++++++++++++++++++++++++++++++++++++++++++++++
            nodes[0].px = rx;
            nodes[0].py = ry;
            nodes[0].vx = 0;
            nodes[0].vy = 0;
            Node.ropePhysics(nodes.ToArray(), 10);


            tx = nodes.Last().px;
            ty = nodes.Last().py;

            vx *= 0.8f;
            vy *= 0.8f;

            //---------------------------------------------------
            rx += cvx;
            ry += cvy;

            tx = Math.Min(Math.Max(0, tx), Screen.PrimaryScreen.Bounds.Width);
            ty = Math.Min(Math.Max(0, ty), Screen.PrimaryScreen.Bounds.Height);

            fx = (int)tx;
            fy = (int)ty;
            Cursor.Position = new Point(fx, fy);

            //-++-+-+-+-+-++-+-+-+-+-++-+-+-+-+-++-+-+-+-+-++-+-+-+-+-++-+-+-+-+-++-+-+-+-+-++-+-+-+-+-++-+-+-+-+-++-+-+-+-+-++


            Invalidate();



        }

        private void Form1_Paint(object sender, PaintEventArgs e)
        {
            var sx = (int)nodes.Min(n => n.px) - 5;
            var ex = (int)nodes.Max(n => n.px) + 5;
            var sy = (int)nodes.Min(n => n.py) - 5;
            var ey = (int)nodes.Max(n => n.py) + 5;
            Location = new Point(sx, sy);
            Size = new Size(ex - sx, ey - sy);

            var g = e.Graphics;
            g.TranslateTransform(-Location.X, -Location.Y);
            for (int i = 0; i < nodes.Count - 1; i++)
            {
                g.DrawLine(new Pen(Color.White, 10), nodes[i].px, nodes[i].py, nodes[i + 1].px, nodes[i + 1].py);
            }
            for (int i = 0; i < nodes.Count - 1; i++)
            {
                g.DrawLine(new Pen(Color.Red, 5), nodes[i].px, nodes[i].py, nodes[i + 1].px, nodes[i + 1].py);
            }
        }

        public enum GWL
        {
            ExStyle = -20
        }

        public enum WS_EX
        {
            Transparent = 0x20,
            Layered = 0x80000
        }

        public enum LWA
        {
            ColorKey = 0x1,
            Alpha = 0xff
        }

        [DllImport("user32.dll", EntryPoint = "GetWindowLong")]
        public static extern int GetWindowLong(IntPtr hWnd, GWL nIndex);

        [DllImport("user32.dll", EntryPoint = "SetWindowLong")]
        public static extern int SetWindowLong(IntPtr hWnd, GWL nIndex, int dwNewLong);

        [DllImport("user32.dll", EntryPoint = "SetLayeredWindowAttributes")]
        public static extern bool SetLayeredWindowAttributes(IntPtr hWnd, int crKey, byte alpha, LWA dwFlags);

        protected override void OnShown(EventArgs e)
        {
            base.OnShown(e);
            int wl = GetWindowLong(this.Handle, GWL.ExStyle);
            wl = wl | 0x80000 | 0x20;
            SetWindowLong(this.Handle, GWL.ExStyle, wl);
            SetLayeredWindowAttributes(this.Handle, 0, 128, LWA.Alpha);
        }
    }
}
